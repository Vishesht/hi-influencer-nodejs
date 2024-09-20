const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adsController = require("../controllers/adsController");

router.post("/login", userController.login);
router.post("/register", userController.register);

router.post("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);
router.get("/userlist/:userId", userController.getUserList);

//ADS
router.post("/postads", adsController.postAds);
router.get("/getallads", adsController.getAllAds);
router.get("/getuserads/:userId", adsController.getUserAds);
router.put("/edituserads/:userId", adsController.editAd);
router.delete("/deleteuserads/:userId", adsController.deleteAd);

module.exports = router;
