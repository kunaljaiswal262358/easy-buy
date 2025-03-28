const express = require("express");
const {
  getProducts,
  getProductById,
  registerProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.js");
const routes = express.Router();
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage });

routes.get("/", getProducts);
routes.get("/:id", getProductById);
routes.post("/",upload.single('image') , registerProduct);
routes.put("/:id", upload.single('image'), updateProduct);
routes.delete("/:id", deleteProduct);

module.exports = routes;
