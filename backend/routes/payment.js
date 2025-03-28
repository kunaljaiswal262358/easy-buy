const express = require('express')
const {createPayment,paymentSuccess} = require('../controllers/payment')
const auth = require('../middleware/auth')
const routes = express.Router()

routes.post("/create",auth,createPayment);
routes.post("/success",paymentSuccess);

module.exports = routes