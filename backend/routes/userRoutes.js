const express = require("express")
const {createUser,doLogin, doLogout,getUser} = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js")

const routes = express.Router();

routes.post("/register",createUser); //creating new user
routes.post("/login",doLogin);
routes.post("/logout",doLogout);
routes.get("/profile",authMiddleware,getUser);

module.exports = routes;