const express = require("express");
const {
  register,
  login,
  profile,
  updateProfile,
} = require("../controllers/user.js");
const routes = express.Router();
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ storage });


routes.post("/register", register);
routes.post("/login", login);
routes.get("/profile/:id", profile);
routes.post("/profile/:id",upload.single('file'), updateProfile);

module.exports = routes;
