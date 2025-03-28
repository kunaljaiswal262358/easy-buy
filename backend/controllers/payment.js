const config = require("config");
const { Payment, validate } = require("../models/payment");
const Stripe = require("stripe");

const stripe = Stripe(config.get("stripeSecretKey"));

const createPayment = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { amount, currency } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: currency,
  });
  const payment = new Payment({
    paymentId: paymentIntent.id,
    amount: amount,
    currency: currency,
    status: "Pending",
  });
  await payment.save();

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

const paymentSuccess = async (req, res) => {
  const { paymentId, status } = req.body;
  if (!status) return res.status(400).send("Status is required");
  const payment = await Payment.findOneAndUpdate(
    { paymentId },
    { status },
    { new: true }
  );
  if (!payment)
    return res.status(400).send("Payment with given id is not found");

  res.send(payment);
};

module.exports = {
  createPayment,
  paymentSuccess,
};
