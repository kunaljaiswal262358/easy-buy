import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const Checkout = ({items, onCheckout}) => {
  const checkoutItems = items.filter(item => item.quantity > 0);
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm items={checkoutItems} onCheckout={onCheckout}/>
    </Elements>
  );
};

export default Checkout;
