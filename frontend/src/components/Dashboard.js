import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const [orders, setorders] = useState([]);
  const {user} = useContext(AuthContext)
  const [globalStatus, setGlobalStatus] = useState("Pending");


  const fetchOrders = async (user) => {
    let res = await fetch(`http://localhost:5000/api/order/getOrders/${user._id}?status=Pending`);
    let result = await res.json();
    setorders(result)
  };

  useEffect(() => {
    if(user)
      fetchOrders(user)
  }, [user]);
  

  const calTotalAmount = (items) => {
    let sum = 0;
    items.forEach((item) => {
      sum += item.product.price * item.quantity;
    });

    return sum;
  };

  const toggleAllOrdersStatus = async () => {
    const newStatus = globalStatus === "Pending" ? "Processing" : "Pending";
    try {
      const res = await fetch(`http://localhost:5000/api/order/getOrders/${user._id}?status=${newStatus}`);
      const result = await res.json()
      console.log(result)
      setorders(result);
      setGlobalStatus(newStatus);
    } catch (error) {
      console.error("Error updating all orders status", error);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Orders</h1>
        <button className="status-button" onClick={toggleAllOrdersStatus}>
          Toggle All Orders Status ({globalStatus})
        </button>
        {(!orders) || orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-content">
                  <h2 className="order-id">Order ID: {order._id}</h2>
                  <h3 className="payment-id">Payment ID: {order.payment.paymentId}</h3>
                  <p className="order-amount">
                    Total Amount: ₹{calTotalAmount(order.items)}
                  </p>
                  <p className="order-status">Status: {order.orderStatus}</p>
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((productItem) => (
                        <tr key={productItem.product._id}>
                          <td>{productItem.product.name}</td>
                          <td>{productItem.quantity}</td>
                          <td>₹{productItem.product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
