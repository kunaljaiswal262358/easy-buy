import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Product.css";

const Product = ({user, onAddToCart, onRemoveFromCart, onBuy}) => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [isInCart, setIsInCart] = useState(false)
  const [product, setProduct] = useState({});

  const handleEdit = () => {
    navigate("/edit-product/"+product._id)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(process.env.REACT_APP_API_ENDPOINT+"/products/"+id);
      toast.success("Product deleted!")
      navigate('/')
    } catch(error) {
      console.log(error)
    }
  }

  const checkForInCart = () => {
    const items = JSON.parse(localStorage.getItem("items")) || []
    setIsInCart(items.some(item => item.product._id === id))
  }

  const fetchProduct = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_ENDPOINT + "/products/" + id
      );
      setProduct(result.data);
    } catch(error) {
      if(error.response.status === 404)  return navigate("/")
      console.log(error)
    }
  };

  useEffect(() => {
    checkForInCart()
  }, [onAddToCart,onRemoveFromCart])
  

  useEffect(() => {
    fetchProduct();
    checkForInCart()
  }, []);

  return (
    <div className="product grid grid--1x2">
      <div className="product__image">
        <img src={product.image} alt="Image of product" />
        {product.stock === 0 ? <span className="badge badge--red">Out of stock</span> :  <span className="badge badge--green">Available</span>}
      </div>
      <div className="product__body">
        <h2 className="title">{product.name}</h2>
        <div>
            <p className="desc">{product.description}</p>
            <p className="price">
              ₹<span>{product.price}.00</span>
            </p>
        </div>
        
        {!(user?.isAdmin) && <div className="product__btns">
          <button onClick={() => {
            if(product.stock === 0) return toast.info("Sorry, Product is out of stock!",{
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })
            onBuy(product)
            navigate("/checkout/"+product._id)
          }
            } className="btn buy-now">Buy now</button>
          
          {isInCart 
          ? <button onClick={()=>onRemoveFromCart(product)} className="btn remove-from-cart">Remove from cart</button>
          : <button onClick={()=>onAddToCart(product)} className="btn add-in-cart">Add in Cart</button>}
        </div>}
        {user?.isAdmin && <button onClick={handleEdit} className="btn btn--edit">Edit</button> }
        {user?.isAdmin && <button onClick={handleDelete} className="btn btn--product-delete">Delete</button> }
      </div>
    </div>
  );
};

export default Product;
