import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const [carts, setCarts] = useState([]);
  const [product, setProduct] = useState(null);
  const {user} = useContext(AuthContext)
  const navigate = useNavigate()

  const getProduct = async () => {
    const response = await fetch(
      `http://localhost:5000/api/products/${productId}`
    );
    let result = await response.json();
    setProduct(result.product);
  };

  const fetchCarts = () => {
    const storedCarts = JSON.parse(localStorage.getItem("products"));
    if(storedCarts) {
        setCarts(storedCarts);
    }
  };

  const addtoCart = (product) => {
    setCarts([...carts, { ...product, quantity: 1 }]);
    localStorage.setItem(
      "products",
      JSON.stringify([...carts, { ...product, quantity: 1 }])
    );
  };

  const removeFromCart = (id) => {
    const updatedCart = carts.filter((product) => product._id !== id);
    setCarts(updatedCart);
    localStorage.setItem("products", JSON.stringify(updatedCart));
  };

  const redirectToPay = () => {
    addtoCart(product)
    navigate("/carts", { state: { scrollToPosition: true } }); // Pass state
  };

  useEffect(() => {
    fetchCarts();
    getProduct();
  }, []);

  if (!product)
    return <div className="product-details-container">Product Not Found!</div>;

  return (
    <div className="product-details-container">
      <div className="product-image">
        <img src={product.image} alt="Image of product" />
      </div>
      <p>{product.name}</p>
      <p>
        Price : ₹<span className="price">{product.price}</span>
      </p>
      {product.description.trim() !== "" ? <p>{}</p> : ""}
      {product.stock === 0 ? (
        <p className="not-available">
          <em>Out of stock</em>
        </p>
      ) : (
        <p className="available">Available</p>
      )}
      <div className="product-btns">
        {user?.role === "Admin" ? "" : <>
            <button onClick={()=>redirectToPay()} className="buy-now">Buy now</button>
        {carts.some(item => item._id === product._id)  ? (
          <button onClick={() => removeFromCart(product._id)} className="remove-from-cart">
            Remove from cart
          </button>
        ) : (
          <button onClick={() => addtoCart(product)} className="add-in-cart">
            Add in Cart
          </button>
        )}</>}
      </div>
    </div>
  );
};

export default ProductDetails;
