import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const params = useParams();
  const orderId = params.orderId
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
          const response = await fetch(
            `http://localhost:5000/api/order/getOrderByOrderId/${orderId}`
          );
          let order = await response.json();
          setOrder(order);
          setStatus(order.OrderStatus);
        //   console.log(order.shippingAddress.fullName)
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
  }
  useEffect( () => {
    fetchOrder()
    
   
  }, [orderId]);

  if (!order) return <div>Order not found</div>;

  const handleChange = (e) => {
    setStatus(e.target.value)    
  }
  // Handle close the order
  const handleCloseOrder = async () => {
    handleStatusChange();
    navigate("/orders")
  };

  // Handle changing the order status
  const handleStatusChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/order/updateOrderStatus/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: status }),
        }
      );
      let result = await response.json()
      setOrder(result.order);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="order-details-container">
      <h2>Order ID: {order._id}</h2>
      <p>
        <strong>Payment ID:</strong> {order.payment.paymentId}
      </p>
      <p>
        <strong>Customer Name:</strong>{order.shippingAddress.fullName}
      </p>
      <p>
        <strong>Address:</strong> {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
      </p>
      <p>
        <strong>Status:</strong> {order.orderStatus}
      </p>
      <p>
        <strong>Items:</strong>
      </p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            <span>{item.product.name}</span><span className="price"> ₹{item.product.price}X{item.quantity}= ₹{item.product.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="order-actions">
        <label htmlFor="status-select">Change Order Status:</label>
        <select
          id="status-select"
          value={status}
          onChange={(e) => handleChange(e)}
        >
             <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
           <option value="Delivered">Delivered</option>
        </select>
        <button disabled={status === "Delivered"}  onClick={handleStatusChange} className={status !== "Delivered" ? "status-btn" : "status-btn disabled"}>
          Update Status
        </button>
      </div>

      {/* Cancel Order */}
      <div className="order-actions">
        <button disabled={status !== "Delivered"}  onClick={handleCloseOrder} className={status === "Delivered" ? "cancel-btn" : "cancel-btn disabled"}>
          close Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
