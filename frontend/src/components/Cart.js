import React, { useEffect, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";

const Cart = ({items, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart}) => {
  const deliveryCharges = 100;

  const getTotalCharges = () => {
    const totalPrice = items.reduce((total, item) => {
      const productAmount = item.product.stock > 0 ? item.product.price : 0;
      return total + productAmount * item.quantity;
    }, 0);
    return totalPrice + deliveryCharges;
  };

  const selectedItems = () => {
    return items.filter(item => item.product.stock > 0)
  }

  return (
    <div className="cart">
      <h1 className="page-title">Cart</h1>
      {items.length === 0 && <p className="no-items">There is no items</p>}
      {items.map((item) => (
        <div key={item.product._id} className="cart-card">
          <img
            className="product-image"
            src={item.product.image}
            alt="Watch image"
          />
          <div className="card__body">
            <div className="product-details">
              <h2 className="title">{item.product.name}</h2>
              <span className="price">₹{item.product.price}</span>
              <span className="avaiblity">
                {item.product.stock === 0 ? (
                  <span className="badge badge--red">Out of Stock</span>
                ) : (
                  <span className="badge badge--green">In Stock</span>
                )}
              </span>
              <span className="highlighted-price">₹{item.product.price}</span>
            </div>
            <div className="product-operation">
              <span className="quantity">
                <i
                  onClick={() => onIncreaseQuantity(item.product)}
                  className="fa-solid fa-plus"
                ></i>
                <span className="current-quantity">{item.quantity}</span>
                <i
                  onClick={() => onDecreaseQuantity(item.product)}
                  className="fa-solid fa-minus"
                ></i>
              </span>
              <button
                onClick={() => onRemoveFromCart(item.product)}
                className="btn delete"
              >
                <i className="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <div className="checkout">
          <div className="charges">
            <div className="selected-products">
              {selectedItems().map(item => <div key={item.product._id}>
                <p><span>{item.product.name}</span> x {item.quantity} = <span>{item.product.price * item.quantity}</span></p>
              </div>)}
                {getTotalCharges() > 100 && <p><span>Delivery Charges = {deliveryCharges} </span></p>}
            </div>
            <p className="total-charge">Total Charges: ₹{getTotalCharges() === 100 ? 0 : getTotalCharges()}</p>
          </div>
          {getTotalCharges() > 100 && <Link className="btn btn--primary checkout-btn" to={"/checkout"}>
            Checkout 
          </Link>}
        </div>
      )}
    </div>
  );
};

export default Cart;
