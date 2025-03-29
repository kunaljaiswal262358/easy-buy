import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-client";
import axios from "axios";
import _ from "lodash";
import "./Order.css";
import './MyOrder.css'

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNumberChange = (number) => {
    console.log(number)
    setCurrentPage(number);
  };

  const handlePreviousChange = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextChange = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleFilterChange = (e) => {
    setCurrentPage(1)
    setStatus(e.target.value)
  }

  const getLimitedOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return _.slice(orders, startIndex, startIndex + pageSize);
  };

  const getDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return month + " " + day + ", " + year;
  };

  const fetchOrders = async (id) => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_ENDPOINT + "/orders/customer/" + id + "?status=" + status
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    const { _id } = jwt.read(token).claim;
    fetchOrders(_id);
  }, [status]);

  return (
    <div className="order-container">
      <div className="order__header header">
        <h1>Order</h1>
      </div>

      
      {loading && <p className="loading-message">Loading orders, please wait..</p>}
      {!loading && <>
        <div className="order-filters">
        <div className="filter-group">
          <button onClick={handleFilterChange} value={""} className={status === "" ? "filter-label  filter-btn" : "filter-option filter-btn"}>All</button>
          <button onClick={handleFilterChange} value={"Pending"}  className={status === "Pending" ? "filter-label filter-btn" : " filter-option filter-btn "}>Pending</button>
          <button onClick={handleFilterChange} value={"Processing"}  className={status === "Processing" ? "filter-label filter-btn" : " filter-option filter-btn "}>Processing</button>
          <button onClick={handleFilterChange} value={"Delivered"}  className={status === "Delivered" ? "filter-label filter-btn" : " filter-option filter-btn "}>Delivered</button>
        </div>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID Order</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Items</th>
              <th>Order Status</th>
            </tr>
          </thead>
          {getLimitedOrders().map((order, index) => (
            <tbody key={order._id}>
              <tr className="order-item">
                <td data-label="ID Order">{index + 1}</td>
                <td data-label="Date">{getDate(order.createdAt)}</td>
                <td data-label="Total">₹{order.totalAmount}</td>
                <td data-label="Payment Status">
                  <span className="payment-status paid">Paid</span>
                </td>
                <td data-label="Items">
                  <ol>
                    {order?.items.map((item) => (
                      <li key={item.product?._id}>{item.product?.name}</li>
                    ))}
                  </ol>
                </td>
                <td data-label="Order Status">
                  {order.orderStatus === "Pending" && (
                    <span className="order-status pending">Pending</span>
                  )}
                  {order.orderStatus === "Processing" && (
                    <span className="order-status processing">Order Processing</span>
                  )}
                  {order.orderStatus === "Delivered" && (
                    <span className="order-status delivered">Delivered</span>
                  )}
                   {order.orderStatus === "Cancelled" && (
                    <span className="order-status cancelled">Cancelled</span>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <div className="pagination">
        <button onClick={handlePreviousChange} disabled={currentPage === 1} className="prev" > Prev</button>
        <div className="numbers">
          {Array.from(
            { length: Math.ceil(orders.length / pageSize) },
            (_, i) => (<button onClick={() => handleNumberChange(i + 1)} key={i} className={currentPage === i + 1 ? "page-number active" : "page-number"}> {i + 1} </button>)
          )}
        </div>
        <button onClick={handleNextChange} disabled={currentPage ===  Math.ceil(orders.length / pageSize)} className="next" >Next</button>
      </div>
      </>}
    </div>
  );
};

export default MyOrder;
