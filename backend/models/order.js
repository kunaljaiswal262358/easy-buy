const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
      "Failed",
    ],
    default: "Pending",
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  pickUpDate :  Date
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
},
{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

const validateOrder = function (order) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    items: Joi.array().items(
      Joi.object({
        product: Joi.objectId().required(),
        quantity: Joi.number().min(1).required(),
      })
    ).required(),
    totalAmount: Joi.number().min(0).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required().max(50),
      address: Joi.string().required().max(50),
      city: Joi.string().required().max(50),
      postalCode: Joi.string().required().max(50),
      state: Joi.string().required().max(50),
      country: Joi.string().required().max(50),
    }).required(),
    paymentId: Joi.objectId().required()
  });

  return schema.validate(order)
};

module.exports.Order = Order;
module.exports.validate = validateOrder
