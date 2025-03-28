const mongoose = require('mongoose')
const Joi = require('joi')

const paymentSchema = new mongoose.Schema({
    paymentId: {type: String, required: true},
    amount: {type: Number, required: true},
    currency: {type: String, required: true},
    status: {type: String, enum: ["Pending","Success"], required: true},
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

const validatePayment = function(payment) {
    const schema = Joi.object({
        amount: Joi.number().min(0).required(),
        currency: Joi.string().required(),
    })

    return schema.validate(payment)
}

module.exports.Payment = Payment
module.exports.validate = validatePayment
