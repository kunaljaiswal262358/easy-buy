import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {useNavigate , useLocation, useLoaderData} from 'react-router-dom'
import { useContext } from "react";
import AuthContext from '../context/AuthContext'
import {
  Elements,
  useElements,
  useStripe,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QndBaKzQ7BmNfqViL2MZS9ZKiusSkY0Eqa9bZA2zh0ZHaPoiQAGKaJn5HQIimjGoZdPLK29ascupSTtDrkJaFUM00kIg3nHDn"
);

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1)
  const checkOutForm = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useContext(AuthContext)

  useEffect(() => {
    const fetchedProduct = localStorage.getItem("products");
    if (fetchedProduct) {
      setProducts(JSON.parse(fetchedProduct));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        checkOutForm.current &&
        !checkOutForm.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.scrollToPosition) {
      checkOutForm.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const removeFromCart = (id) => {
    const updatedCart = products.filter((product) => product._id !== id);
    setProducts(updatedCart);
    localStorage.setItem("products", JSON.stringify(updatedCart));
  };

  const sumOfPrice = () => {
    let sum = 0;
    products.forEach((product) => {
      sum += product.price * product.quantity;
    });
    return sum;
  };

  const calItems = () => {
    let numOfItem = 0;
    products.forEach(product => {
      numOfItem += product.quantity
    })

    return numOfItem;
  }

  const updateQuantity = (e,id) => {
    if(e.target.value > 0) {
      const updatedProducts = products.map(product => product._id === id ? {...product, quantity: Number(e.target.value)} : product)
      setProducts(updatedProducts)
      localStorage.setItem("products",JSON.stringify(updatedProducts))
    }
  }

  const clearCarts = () => {
    localStorage.removeItem("products");
    setProducts([])
  }

  const saveOrder = (order) => {
    const orders = JSON.parse(localStorage.getItem("orders"))
    if(!orders)
      orders=[]
    localStorage.setItem("orders",JSON.stringify([...orders, order]))
  }

  const placeOrder = async (paymentId) => {
    const order = {
      user: user._id,
      items: products.map(p => ({product: p._id,quantity: p.quantity})),
      totalAmount: sumOfPrice(),
      payment: paymentId,
      shippingAddress: user.shippingAddress
    }
    const response = await fetch("http://localhost:5000/api/order/makeOrder",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)
      }
    )
    let result = await response.json();
    saveOrder(result.order)
    clearCarts()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get PaymentIntent from the backend
    const response = await fetch(
      "http://localhost:5000/api/payments/createPayment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: sumOfPrice(), currency: "inr" }), // Change amount as needed
        credentials: "include"
      }
    );
    let paymentIntent = await response.json()
    console.log(response.status)
    if(response.status === 401) return navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)

    const { clientSecret } = paymentIntent;

    // Confirm Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        elements.getElement(CardNumberElement).clear();
        elements.getElement(CardExpiryElement).clear();
        elements.getElement(CardCvcElement).clear();
        setIsOpen(false)
        // savePayment
        let savedPayment = await fetch(
          "http://localhost:5000/api/payments/paymentSuccess",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: result.paymentIntent.id }), // Change amount as needed
          }
        );

        savedPayment = await savedPayment.json()
        placeOrder(savedPayment._id)
      }
    }

    setLoading(false);
  };

  return (
    <>
      <section className="cart-section">
        <div className="selected">
          {products.map((product) => (
            <>
              <div key={product._id} className="selcProduct">
                <div className="pImage">
                  <img src={product.image} alt="image of product" />
                </div>
                <div className="pDetails">
                  <p>{product.name}</p>
                  <p>
                    Price: <span>{product.price}</span>$
                  </p>
                  <p>{product.description}</p>
                  <label htmlFor="numberOfItems">Quantity</label>
                  <input type="number" name="numberOfItems" id="numberOfItem" value={product.quantity} onChange={(e)=>updateQuantity(e,product._id)} />
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(product._id)}
                  >
                    Remove from cart
                  </button>
                </div>
              </div>
              <div className="seperation"></div>
            </>
          ))}
        </div>
        <div className="checkOut">
          <p>
            Selected items: <span>{calItems()}</span>
          </p>
          <p>
            Total Price: <span>{sumOfPrice()}</span>₹
          </p>

          <button onClick={()=>setIsOpen(true)}>CheckOut</button>

          {isOpen ? (
            <div ref={checkOutForm} className="checkOutForm">
              <form onSubmit={handleSubmit}>
                <label>Card Number</label>
                <CardNumberElement />

                <label>Expiry Date</label>
                <CardExpiryElement />

                <label>CVC</label>
                <CardCvcElement />
                <p>Quantity: <span>{calItems()}</span></p>
                <p>Amount: <span>{sumOfPrice()}</span></p>
                <button type="submit" disabled={!stripe || loading || (sumOfPrice() === 0  && products.length === 0)}>
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>
            </div>
          ) : (
            " "
          )}
        </div>
      </section>
    </>
  );
};

const Carts = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Carts;
