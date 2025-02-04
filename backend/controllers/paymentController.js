const Stripe = require('stripe');
const Payment = require('../models/payment')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const createPayment = async (req, res) => {

    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert amount to cents
            currency: currency,
        });
    
        const payment = new Payment({
            paymentId: paymentIntent.id,
            amount: amount,
            currency: currency,
            status: "Pending",
        });

        await payment.save();

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}

const paymentSuccess = async (req, res) => {

    try {
        const {paymentId} = req.body
        const result = await Payment.findOneAndUpdate({ paymentId }, { status: "Success" });
    
        res.json(result);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPayment,
    paymentSuccess,
}