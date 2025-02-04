import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-options">
        <a to="/admin/orders" className="dashboard-button">View All Orders</a>
        <a to="/admin/products" className="dashboard-button">View All Products</a>
      </div>
    </div>
  )
}

export default AdminDashboard
