import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders when component loads
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/getAllOrders');
      let result = await response.json();
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/order/:orderId=${orderId}`,
        {
            method: "Patch",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status: newStatus})
        }
      )
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
        await fetch(`http://localhost:5000/api/order/:orderId=${orderId}`,
            {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            }
          )
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="container">
      <h2>All Orders</h2>
      
      {/* Orders displayed as boxes */}
      <div className="orders-container">
        {orders.map((order) => (
          <Link to={`/order/${order._id}`} style={{textDecoration: "none",color: "blue"}}>
          <div key={order._id} className="order-box">
            <h3>Order ID: {order._id}</h3>
            <p><strong>Payment ID:</strong> {order.payment.paymentId}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <div>
              {/* <Link to={`/order/${order._id}`}>
                <button className="manage-btn">Manage Order</button>
              </Link> */}
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
