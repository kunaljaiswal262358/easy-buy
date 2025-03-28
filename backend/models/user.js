const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  image: {
   type: {
    data: String,        // Store Base64 string
    contentType: String  // Store image type (JPEG, PNG, etc.)
   },
   default: null,
   _id: false
},
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  postalCode: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});

userSchema.methods.generateAuthToken = function () {
  const user = this.toObject();
  return jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin  },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = function (user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required().min(5).max(50),
    password: Joi.string().required().min(5).max(15),
    image: Joi.objectId({
      data: Joi.string().required(),
      contentType: Joi.string().required()
    }),
    address: Joi.string().max(50),
    city: Joi.string().max(50),
    postalCode: Joi.string().max(50),
    state: Joi.string().max(50),
    country: Joi.string().max(50),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
