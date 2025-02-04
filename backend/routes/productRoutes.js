const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');

const routes = express.Router();

routes.get('/', getAllProducts);  // Fetch all products with filtering
routes.get('/:id', getProductById);  // Fetch a single product by ID
routes.post('/',createProduct); // create a product
routes.put('/:id',updateProduct); // update product
routes.delete('/:id',deleteProduct); // delete product

module.exports = routes;
