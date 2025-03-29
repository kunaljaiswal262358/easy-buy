import React, { useRef, useState } from "react";
import axios from "axios";
import Joi from "joi";
import "./AddProduct.css";
import { toast } from "react-toastify";

const AddProduct = ({onAddProduct}) => {
  const image = useRef()
  const [error, setError] = useState({})
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "null",
    category: "",
    brand: "",
    stock: "",
    image: null,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setButtonDisabled(false)
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setProduct({ ...product, image: selectedFile });
    setButtonDisabled(false)
  };

  const validateProduct = () => {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100).label("Name"),
      description: Joi.string().min(5).max(512).label("Description"),
      price: Joi.number().min(0).label("Price").messages({'number.base': 'Price not allowed to empty',}),
      category: Joi.string().label("Category"),
      brand: Joi.string().label("Brand").min(3),
      stock: Joi.number().label("Stock").min(0).messages({'number.base': 'Stock not allowed to empty',}),
      image: Joi.object().required().messages({'*': 'Image is required'})
    });

    return schema.validate(product, { abortEarly: false });
  };

  const convertInValidProduct = (product) => {

    const valid = {...product};
    valid.stock = Number(valid.stock)
    valid.price = Number(valid.price)

    return valid
  }

  const checkForErrors = () => {
    const result = validateProduct();
    const error = {}
    if(result.error) {
      result.error.details.forEach(e=> error[e.path[0]] = e.message)
      setError(error)
      return true;
    }
    setError({})

    return false;
  }

  const handleSave = async () => {
    if(checkForErrors()) return;
    setButtonDisabled(true)
    
    const validProduct = convertInValidProduct(product)
    const error = await onAddProduct(validProduct)
    if(error){
      setError({generic: "Duplicate product name"});
      return;
    }
    
    setProduct({
      name: "",
      description: "",
      price: "null",
      category: "",
      brand: "",
      stock: "",
      image: null,
    })
    image.current.value = ""
  };

  return (
    <div className="product-form">
      <h2>Add New Product</h2>

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
        {error.description && <p className="form__error">{error.description}</p>}
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
        <input
        ref={image}
          type="file"
          id="product-image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {error.image && <p className="form__error">{error.image}</p>}
      </div>

      <div className="form-actions">
        <button disabled={buttonDisabled} onClick={handleSave} className={`primary-button ${buttonDisabled ? "disabled" : ""}`}>
          Save Product
        </button>
        <button className="secondary-button">Cancel</button>
      </div>
      {error.generic && <p className="form__error">{error.generic}</p>}
    </div>
  );
};

export default AddProduct;
