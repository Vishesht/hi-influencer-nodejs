const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);

module.exports = router;
