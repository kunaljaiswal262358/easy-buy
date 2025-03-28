const { User, validate } = require("../models/user");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const salt = 10;
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user = new User(req.body);

  await user.save();

  const token = user.generateAuthToken();
  user = user.toObject();
  delete user.password;


  res
    .status(201)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(user);
};

const login = async (req, res) => {
  if (!req.body.email) return res.status(400).send("Email is required");

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is invalid");

  if (!req.body.password) return res.status(400).send("Password is required");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) return res.status(400).send("Invalid password");

  const token = user.generateAuthToken();
  res.status(200).send(token);
};

const profile = async (req, res) => {
  let user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(400).send("User with given id is not found");

  user = user.toObject()
  user.image =  user.image ? `data:${user.image.contentType};base64,${user.image.data}` : null
  res.send(user);
};

const updateProfile = async (req, res) => {
  const payload = {...req.body}
  if (req.file) {
    payload.image = {
      data: req.file.buffer.toString("base64"),
      contentType: req.file.mimetype,
    };
  }

  let user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  });
  if (!user) return res.status(400).send("User with given id is not found");

  user = user.toObject()
  user.image =  user.image ? `data:${user.image.contentType};base64,${user.image.data}` : null
  res.send(user);
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
};
