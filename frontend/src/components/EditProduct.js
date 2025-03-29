import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";
import "./AddProduct.css";
import "./EditProduct.css";

const EditProduct = ({products , onEdit}) => {
  const navigate = useNavigate();
  const image = useRef();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState({});
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: null,
  });
  const [selected, setSelected] = useState(null)

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPreview(URL.createObjectURL(selectedFile));
    setProduct({ ...product, image: selectedFile });
    setIsChanged(true);
  };

  const base64ToFile = async (base64String, fileName) => {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
}

  const validateProduct = () => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100).label("Name"),
      description: Joi.string().min(5).max(512).label("Description"),
      price: Joi.number()
        .min(0)
        .label("Price")
        .messages({ "number.base": "Price not allowed to empty" }),
      category: Joi.string().label("Category"),
      brand: Joi.string().label("Brand").min(3),
      stock: Joi.number()
        .label("Stock")
        .min(0)
        .messages({ "number.base": "Stock not allowed to empty" }),
      image: Joi.object().required().messages({ "*": "Image is required" }),
    });

    return schema.validate(product, { abortEarly: false });
  };

  const convertInValidProduct = (product) => {
    const valid = { ...product };
    valid.stock = Number(valid.stock);
    valid.price = Number(valid.price);

    return valid;
  };

  const checkForErrors = () => {
    const result = validateProduct();
    const error = {};
    if (result.error) {
      result.error.details.forEach((e) => (error[e.path[0]] = e.message));
      setError(error);
      return true;
    }
    setError({});

    return false;
  };

  const handleEdit = async () => {
    if (checkForErrors()) return;

    const validProduct = convertInValidProduct(product);
    
    setIsChanged(false)
    navigate("/product/" + id); 
    onEdit({...selected, ...validProduct, image: preview})
  };

  const fetchProduct = async () => {
    try {
      const product = products.find(p => p._id === id);
       if(!product) return navigate("/");
      const imageFile = await base64ToFile(product.image, "image.png");
      setProduct({
        name: product.name,
        description: product.description,
        price: product.price === 0 ? "" : product.price,
        category: product.category,
        brand: product.brand,
        stock: product.stock === 0 ? "" : product.stock,
        image: imageFile,
      });
      setSelected(product)
      setPreview(product.image);
    } catch(error) {
      if(error.response.status === 400 || error.response.status === 500) navigate("/")
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [products]);

  return (
    <div className="product-form">
      <h2>Edit Product</h2>

      <div className="form-section">
        <label htmlFor="product-name">Product Name</label>
        <input
          type="text"
          id="product-name"
          placeholder="Enter product name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
        {error.name && <p className="form__error">{error.name}</p>}
      </div>

      <div className="form-section">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          placeholder="Enter product description"
          name="description"
          value={product.description}
          onChange={handleChange}
        ></textarea>
        {error.description && (
          <p className="form__error">{error.description}</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="product-price">Price ($)</label>
        <input
          type="number"
          id="product-price"
          placeholder="0.00"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
        {error.price && <p className="form__error">{error.price}</p>}
      </div>

      <div className="form-section">
        <label htmlFor="product-category">Category</label>
        <select
          id="product-category"
          name="category"
          value={product.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Shoes">Shoes</option>
        </select>
        {error.category && <p className="form__error">{error.category}</p>}
      </div>

      <div className="form-section">
        <label htmlFor="product-brand">Brand</label>
        <input
          type="text"
          id="product-brand"
          name="brand"
          value={product.brand}
          onChange={handleChange}
        />
        {error.brand && <p className="form__error">{error.brand}</p>}
      </div>

      <div className="form-section">
        <label htmlFor="product-stock">Number in Stock</label>
        <input
          type="number"
          id="product-stock"
          placeholder="0"
          name="stock"
          value={product.stock}
          onChange={handleChange}
        />
        {error.stock && <p className="form__error">{error.stock}</p>}
      </div>

      <div className="form-section">
        <label htmlFor="product-image">Product Image</label>

        <span className="product-edit-image">
          {preview && <img width={50} src={preview} alt="Product image" />}
          <input
            ref={image}
            type="file"
            id="product-image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </span>
        {error.image && <p className="form__error">{error.image}</p>}
      </div>

      <div className="form-actions">
        <button
          disabled={!isChanged}
          onClick={handleEdit}
          className={isChanged ? "primary-button" : "primary-button disabled"}
        >
          Save Product
        </button>
        <button onClick={()=> navigate("/product/"+id)} className="secondary-button">Cancel</button>
      </div>
    </div>
  );
};

export default EditProduct;
