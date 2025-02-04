const express = require('express')
const {createPayment,paymentSuccess} = require('../controllers/paymentController')
const paymentMiddleware = require('../middleware/paymentMiddleware')
const routes = express.Router()

routes.post("/createPayment",paymentMiddleware,createPayment);
routes.post("/paymentSuccess",paymentSuccess);

module.exports = routes