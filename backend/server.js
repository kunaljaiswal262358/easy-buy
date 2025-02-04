const express = require('express');
const connectDB = require('./config/database');
const bodyParse = require('body-parser');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express();

//connect to db
connectDB();

//middlewares
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
  }));
app.use(cookieParse());
app.use(bodyParse.json());

app.use("/api/products",productRoutes);
app.use("/api/user",userRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/order",orderRoutes);

app.listen(5000, () => console.log(`Server running on http://0.0.0.0:5000`));