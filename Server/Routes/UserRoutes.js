const express = require("express");
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  getUserController,
} = require("../Controllers/UserController");
const protect = require("../Middleware/authMiddleware");

router.post("/login", loginUserController);

router.post("/register", registerUserController);

router.get("/getUsers", protect, getUserController);

module.exports = router;
