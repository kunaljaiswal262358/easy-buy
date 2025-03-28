const mongoose = require('mongoose');
const Joi = require('Joi')
Joi.objectId = require('joi-objectid')(Joi)

const productSchema = new mongoose.Schema({
  name: { type: String, required: true , unique: true },
  description: { type: String},
  price: { type: Number, required: true },
  category: { type: String, enum: ['Electronics', 'Furniture', 'Clothing', 'Shoes'], required: true },
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  image: { 
    type: {
      data: String,        
      contentType: String  
   },
   default: null,
   _id: false ,
   required: true
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const validateProduct = function (product) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().min(5).max(512),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    brand: Joi.string().required().min(3),
    stock: Joi.number().min(0).required(),
    ratings: Joi.number().min(0).max(5),
    // image: Joi.object({
    //   data: Joi.string().required(),
    //   contentType: Joi.string().required()
    // }).required()
  })

  return schema.validate(product)
}
module.exports.Product = Product;
module.exports.validate = validateProduct;
