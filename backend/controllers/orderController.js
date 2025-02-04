const Order = require('../models/order')

const makeOrder = async (req,res) => {
    try {
        const { user, items, totalAmount, shippingAddress, payment } = req.body;

        if (!user || !items || !totalAmount || !shippingAddress || !payment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const order = new Order({
            user,
            items,
            totalAmount,
            shippingAddress,
            payment
        });

        const savedOrder = await order.save();
        res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const getOrderById = async (req,res) => {
    try {
        let status = req.query.status
        const orders = await Order.find({user : req.params.userId,orderStatus: status}).populate("items.product").populate("payment");
        res.status(200).json(orders)
    } catch(error) {
        res.status(500).json({message: "server error",error: error.message})
    }
}

const getOrderByOrderId = async (req,res) => {
    try {
        let {orderId} = req.params
        const order = await Order.findOne({_id : orderId}).populate("items.product").populate("payment");
        res.status(200).json(order)
    } catch(error) {
        res.status(500).json({message: "server error",error: error.message})
    }
}



const updateOrderStatus = async (req,res) => {
    try {
        const { orderStatus } = req.body;
        const validStates = ["Pending", "Processing", "Delivered", "Cancelled"];

        if (!validStates.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate({_id : req.params.orderId}, { orderStatus }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const getAllOrdersExceptDelivered = async (req, res) => {
    try {
        const orders = await Order.find({orderStatus: { $ne: "Delivered" }}).populate("items.product").populate("payment")
        res.status(200).json(orders)
    } catch(error) {
        res.status(500).json({message: "server error",error: error.message})
    }
}

const deleteOrder = async (req, res) => {
    const {orderId} = req.params;
    if(!orderId) return res.status(400).json({message: "Invalid order Id"})
    try {
        const orders = await Order.deleteOne({_id : orderId});
        res.status(200).json({message: "Order deleted successfully"})
    } catch(error) {
        res.status(500).json({message: "server error",error: error.message})
    }
}

module.exports = {
    makeOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrdersExceptDelivered,
    deleteOrder,
    getOrderByOrderId
}