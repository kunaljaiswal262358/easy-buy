require('express-async-errors')
const express = require('express')
const cors = require('cors');
const product = require('../routes/product');
const user = require('../routes/user');
const payment = require('../routes/payment')
const order = require('../routes/order')
const error = require('../middleware/error')

module.exports = function(app) {
    app.use(cors({
        origin: "*",
        credentials: true 
      }));
    app.use(express.json());
    
    app.use("/api/users",user);
    app.use("/api/products",product);
    app.use("/api/payments",payment);
    app.use("/api/orders",order);
    app.use(error());
}