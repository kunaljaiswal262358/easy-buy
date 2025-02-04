const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { email, password, confirmPassword, mobile, shippingAddress } =
    req.body;

  const role = req.body.role;

  //validation
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passowrd mismatch" });
  }
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be 8 or more than 8 characters long" });
  if (mobile.toString().length !== 10)
    return res.status(400).json({ message: "Invalid mobile number" });
  if (role)
    if (role !== "Admin" && role !== "User")
      return res.status(400).json({ message: "Invalid role" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    if (role) {
      user = new User({
        email,
        password: hashedPassword,
        mobile,
        shippingAddress: shippingAddress,
        role
      });
    } else {
      user = new User({
        email,
        password: hashedPassword,
        mobile,
        shippingAddress: shippingAddress,
      });
    }

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const doLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.cookie("token", token);
    res.status(200).json({ message: "Login Successful", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const doLogout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

module.exports = {
  createUser,
  doLogin,
  doLogout,
  getUser,
};
