const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderByCustomerId,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
} = require("../controllers/order");

const routes = express();

routes.post("/", createOrder);
routes.get("/", getOrders);
routes.get("/:id", getOrderById);
routes.get("/customer/:id", getOrderByCustomerId);
routes.put("/updateStatus/:id", updateOrderStatus);
routes.delete("/:id", deleteOrder);

module.exports = routes;
