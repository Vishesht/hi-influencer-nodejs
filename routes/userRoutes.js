const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.put("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);

module.exports = router;
