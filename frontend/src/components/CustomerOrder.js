import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Order.css'
import './CustomerOrder.css'

const CustomerOrder = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState({})
    const [show, setShow] = useState("customer")
    const [loading, setLoading] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    const handleShowChange = (e) => {
      setShow(e.target.value)
    }

    const handleStatusChange = async (status) => {
      if(status === 'Cancelled') setCancelling(true)
      else  setLoading(true)
        try {
            const {data} = await axios.put(process.env.REACT_APP_API_ENDPOINT+ "/orders/updateStatus/"+id,{status})
            setOrder(data)
          } catch (error) {
            console.log(error)
          }
      setLoading(false)
      setCancelling(false)
    }


    const getDate = (isoString) => {
        const date = new Date(isoString);
        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const year = date.getFullYear();
        const time = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }).format(date);
        return time + ", " + month + " " + date.getDate() + ", " + year;
      };

    const fetchOrder = async () => {
        try {
           const {data} = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/orders/"+id)
           setOrder(data)
           setShow("customer")
        } catch (error) {
            console.log(error)
            navigate("/")
        }
    }

    useEffect(() => {
      fetchOrder()
    }, [])
    
  return (
    <div className="order-card">
      <div className="card-header">
        <div className="order-info">
          <p className='order-number'>Order Number #256894</p>
          <p className='order-date'>Order Created</p>
          {order.createdAt && <p className='others'>{getDate(order.createdAt)}</p>}
        </div>
      </div>

      <div className="card-body">
        <div className="navigation">
          <button className={show === "customer" ? "active" : ""} value={'customer'} onClick={handleShowChange}>Customer Details</button>
          <button className={show === "address" ? "active" : ""} value={'address'} onClick={handleShowChange}>Delivery Address</button>
        </div>

        <div className="customer-details">
           {show === "customer" && <>
            <div className="detail-row">
                <span>Name</span>
                <span>{order?.customerId?.name}</span>
            </div>
            <div className="detail-row">
                <span>Email</span>
                <span>{order?.customerId?.email}</span>
            </div>
           </>}
           {show === "address" && <>
            <div className="detail-row">
                <span>Address Line</span>
                <span>{`${order?.customerId?.address}`}</span>
            </div>
          <div className="detail-row">
            <span>City</span>
            <span>{order?.customerId?.city}</span>
          </div>
          <div className="detail-row">
            <span>Postcode</span>
            <span>{order?.customerId?.postalCode}</span>
          </div>
          <div className="detail-row">
            <span>State</span>
            <span>{order?.customerId?.state}</span>
          </div>
          </>}
        </div>

        <div className="order-history">
          <h3>Order History</h3>
          {order?.orderStatus === "Cancelled" && <div className="history-item">
            <span>Order Cancelled</span>
            <span>{getDate(order.updatedAt)}</span>
          </div>}
          {order?.orderStatus === "Delivered" && <div className="history-item">
            <span>Order is Delivered</span>
            <span>{getDate(order.updatedAt)}</span>
          </div>}
          {order?.pickUpDate && <div className="history-item">
            <span>Order is Picked</span>
            <span>{getDate(order.pickUpDate)}</span>
          </div>}
          {order.createdAt && <div className="history-item">
            <span>Order Placed</span>
            <span>{getDate(order.createdAt)}</span>
          </div>}
          {!(order?.orderStatus === "Cancelled" || order?.orderStatus === "Delivered") && <button onClick={()=>handleStatusChange("Cancelled")} disabled={cancelling} className="cancel-btn">{(cancelling) ? "Cancelling" : "Cancel Order"}</button>}
        </div>
        <div className="order-summary">
          <h3>Item Summary</h3>
          <div className="summary-header">
            <span>QTY</span>
            <span>Price</span>
            <span>Total Price</span>
          </div>
          {order?.items?.map(item => <div key={item.product._id} className="summary-item">
            <span>{item.product.name}, x{item.quantity}</span>
            <span>₹{item.product.price }</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>)}
          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>₹100.00</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        {order?.orderStatus === "Pending" && <button onClick={()=>handleStatusChange("Processing")} disabled={loading} className="home-btn">{loading ? "Processing..." : "Process Order"}</button>}
        {order?.orderStatus === "Processing" && <button onClick={()=>handleStatusChange("Delivered")} disabled={loading} className="home-btn">{loading ? "Processing..." : "Mark as Deliverd"}</button>}
        {/* <button className="home-btn">Back to Home</button> */}
      </div>
    </div>
  )
}

export default CustomerOrder
