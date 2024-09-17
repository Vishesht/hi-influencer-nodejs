const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);
router.get("/userlist/:userId",userController.getUserList)

module.exports = router;
