import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'
import './Order.css';
import './CustomerOrders.css';

const CustomerOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setCurrentPage(1)
    setStatus(e.target.value)
  }

  const handleNumberChange = (number) => {
    setCurrentPage(number);
  };

  const handlePreviousChange = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextChange = () => {
    setCurrentPage(currentPage + 1);
  };

  const getDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return month + " " + day + ", " + year;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const {data } = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/orders?status="+status+"&page="+currentPage)

      setOrders(data.orders)
      setTotalPages(data.totalPages)
      setLoading(false);
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [status,currentPage])

  useEffect(() => {
    fetchOrders()
  }, [])
  
  return (
    <div className="order-container">
      <div className="order-header">
        <div className="order-stats">
          <div className="stat-item">
            <h3>Total Orders</h3>
            <p>3210</p>
          </div>
          <div className="stat-item">
            <h3>Ordered items over time</h3>
            <p>3210</p>
          </div>
          <div className="stat-item">
            <h3>Returns</h3>
            <p>3210</p>
          </div>
          <div className="stat-item">
            <h3>Fulfilled orders over time</h3>
            <p>3210</p>
          </div>
        </div>
        <button className="more-action-btn">More Action</button>
      </div>

      <div className="order-filters">
        <div className="filter-group">
          <button onClick={handleFilterChange} value={""} className={status === "" ? "filter-label  filter-btn" : "filter-option filter-btn"}>All</button>
          <button onClick={handleFilterChange} value={"Pending"}  className={status === "Pending" ? "filter-label filter-btn" : " filter-option filter-btn "}>Pending</button>
          <button onClick={handleFilterChange} value={"Processing"}  className={status === "Processing" ? "filter-label filter-btn" : " filter-option filter-btn "}>Processing</button>
          <button onClick={handleFilterChange} value={"Delivered"}  className={status === "Delivered" ? "filter-label filter-btn" : " filter-option filter-btn "}>Delivered</button>
        </div>
      </div>

      {!loading && totalPages === 0 && <p>There is no orders</p>}
      {loading && <p>Loading orders, please wait...</p>}
      {!loading && totalPages > 0 && <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Items</th>
              <th>Order Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className='order-item'>
                <td data-label="ID Order">{order._id}</td>
                <td data-label="Date">{getDate(order.createdAt)}</td>
                <td data-label="Customer">{order.customerId.name + " ("+order.customerId._id.slice(-4) +")"}</td>
                <td data-label="Total">{order.totalAmount}</td>
                <td data-label="Payment Status">
                  <span className={`payment-status ${order.paymentId ? "paid" : "unpaid"}`}>
                    {order.paymentId ? "paid" : "unpaid"}
                  </span>
                </td>
                <td data-label="Items">{order.items.length}</td>
                <td data-label="Order status">
                  <span className={`order-status ${order.orderStatus.toLowerCase()?.replace(' ', '-')}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className='order-process-btns'>
                  <button onClick={()=>navigate("/customer-order/"+order._id)} className='order-process-btn'>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
        <button onClick={handlePreviousChange} disabled={currentPage === 1} className="prev" > Prev</button>
        <div className="numbers">
          {Array.from(
            { length: totalPages },
            (_, i) => (<button onClick={() => handleNumberChange(i + 1)} key={i} className={currentPage === i + 1 ? "page-number active" : "page-number"}> {i + 1} </button>)
          )}
        </div>
        <button onClick={handleNextChange} disabled={currentPage ===  totalPages} className="next" >Next</button>
      </div>
      </div>}
    </div>
  );
};

export default CustomerOrders;