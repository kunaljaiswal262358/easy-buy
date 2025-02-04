const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true , unique: true },
  description: { type: String},
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  image: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
