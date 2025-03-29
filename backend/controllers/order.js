const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");

const createOrder = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = new Order({
    customerId: req.body.customerId,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    shippingAddress: req.body.shippingAddress,
    paymentId: req.body.paymentId,
  });

  const items = req.body.items;

  items.forEach(async item => {
    const id = item.product;
    const product = await Product.findById(id)
    if((product.stock - item.quantity) >= 0)
      product.stock -= item.quantity;
    await product.save()
  })

  await order.save();
  res.status(201).send(order);
};

const getOrders = async (req, res) => {
  const status = req.query.status
  let query = {}
  if(status) query.orderStatus = status
  
  const pageSize = 10;
  const currentPage = Number(req.query.page) || 1
  const skip = (currentPage - 1) * pageSize

  const totalOrders = await Order.countDocuments(query);

  let orders = await Order.find(query)
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: "items.product",
      select: "-image" 
    })
    .populate("paymentId")
    .populate({
      path: "customerId",
      select: "-password -image"
    })
    .sort({ _id: -1 });
  
   
  res.send({orders,totalPages: Math.ceil(totalOrders / pageSize)});
};

const getOrderById = async (req, res) => {
  let order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("paymentId")
    .populate("customerId");
  if (!order) return res.status(400).send("Order with given id is not found");

  order = order.toObject();
  delete order.customerId.password
  res.send(order);
};

const getOrderByCustomerId = async (req, res) => {
  const filter = {customerId: req.params.id}
  if(req.query.status) filter.orderStatus = req.query.status;
  
  const order = await Order.find(filter)
    .populate("items.product")
    .populate("paymentId")
    .sort({ _id: -1 });

  res.status(200).json(order);
};

const updateOrderStatus = async (req, res) => {
  const status = req.body.status;
  if (!status) return res.status(400).send("Status is not provided");

  let payload = {orderStatus: status};
  if(status === "Processing") 
    payload.pickUpDate = new Date().toISOString();

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    payload,
    { new: true }
  ).populate("items.product")
  .populate("paymentId")
  .populate("customerId");;
  if (!order)
    return res
      .status(404)
      .send("Order with given id is not found");

  res.send(order);
};

const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(400).send("Order with given id is not found");

  res.send(order)
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByCustomerId,
  updateOrderStatus,
  deleteOrder,
};
