const express = require("express");
const {
  makeOrder,
  updateOrderStatus,
  getOrderById,
  getAllOrdersExceptDelivered,
  deleteOrder,
  getOrderByOrderId
} = require("../controllers/orderController");

const routes = express();

routes.post("/makeOrder", makeOrder);
routes.put("/updateOrderStatus/:orderId", updateOrderStatus);
routes.get("/getOrders/:userId", getOrderById);
routes.get("/getAllOrders/", getAllOrdersExceptDelivered);
routes.delete("/deleteOrder/:orderId", deleteOrder);
routes.get("/getOrderByOrderId/:orderId", getOrderByOrderId);

module.exports = routes;
