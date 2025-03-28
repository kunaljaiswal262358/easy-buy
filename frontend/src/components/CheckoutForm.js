import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-client";
import axios from "axios";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "./CheckoutForm.css";

const CheckoutForm = ({items , onCheckout}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null)

  const placeOrder = async (customerId, paymentId) => {
    try {
      const orderedItems = items.map((item) => {
        const obj = {
          product: item.product._id,
          quantity: item.quantity,
        };
        return obj;
      });

      const shippingAddress = {
        fullName: user.name,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        state: user.state,
        country: user.country,
      };

      const payload = {
        customerId: customerId,
        items: orderedItems,
        totalAmount: getAmount(),
        shippingAddress,
        paymentId: paymentId,
      };
      await axios.post(process.env.REACT_APP_API_ENDPOINT + "/orders", payload);
      onCheckout(items)
      navigate("/orders")
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "/payments/create",
        { amount: getAmount(), currency: "inr" },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      if (!data.clientSecret) {
        console.error("Payment initialization failed!");
        setLoading(false);
        return;
      }

      const confirmPayment = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      setLoading(false);

      if (confirmPayment.error) {
        console.error(confirmPayment.error);
        toast.error("Payment failed!");
      } else {
        toast.info("Payment successful!");

        const result = await axios.post(
          process.env.REACT_APP_API_ENDPOINT + "/payments/success",
          { paymentId: confirmPayment.paymentIntent.id, status: "Success" }
        );

        const paymentId = result.data._id;
        const customerId = user._id
        placeOrder(customerId, paymentId);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAmount = () => {
    return (
      100 +
      items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0)
    );
  };

  const populateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const {_id} = jwt.read(token).claim
    const { data: user } = await axios.get(
      process.env.REACT_APP_API_ENDPOINT + "/users/profile/" + _id
    );
    const {name, address, city, postalCode, state, country} = user
    if(!name || !address || !city || !postalCode || !state || !country) {
      navigate("/profile")
      return
    }
    setUser(user)
  }

  useEffect(() => {
    populateUser()
    if(items.length === 0) navigate("/")
  }, []);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment</h2>
        <div className="selected-products">
          {items.map((item) => (
            <div key={item.product._id}>
              <p>
                <span>{item.product.name}</span> x {item.quantity} ={" "}
                <span>{item.product.price * item.quantity}</span>
              </p>
            </div>
          ))}
          <p>
            <span>Delivery Charges = {100} </span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="card-element-container">
            <CardElement className="card-element" />
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="btn btn--primary payment-button"
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              `Pay ₹ ${getAmount()}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
