const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adsController = require("../controllers/adsController");
const ordersController = require("../controllers/ordersController");

router.post("/login", userController.login);
router.post("/register", userController.register);

router.post("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);
router.get("/userlist/:userId", userController.getUserList);
router.get("/admin/userlist", userController.getAdminUserList);
router.post("/users/details", userController.getUserDetailsByIds);
router.put("/users/:id/influencer", userController.verifyAccount);

//ADS
router.post("/postads", adsController.postAds);
router.get("/getallads/:userId", adsController.getAllAds);
router.get("/getuserads/:userId", adsController.getUserAds);
router.put("/edituserads/:userId", adsController.editAd);
router.delete("/deleteuserads/:userId", adsController.deleteAd);
router.post("/ads/:adId/apply", adsController.applyForAd);
// Route for accepting an applicant
router.post("/ads/:adId/accept/:userId", adsController.acceptApplicant);
// Route for rejecting an applicant
router.post("/ads/:adId/reject/:userId", adsController.rejectApplicant);

//Hire Influencer
router.post("/saveneworder", ordersController.saveneworder);
router.get("/getorders/:userId", ordersController.getOrderById);
router.get(
  "/getOrderByInfluencerId/:userId",
  ordersController.getOrderByInfluencerId
);

//Admin

//Orders
router.get("/admin/getAllOrders", ordersController.getAllOrders);
// router.put("/admin/approveOrder", ordersController.approveOrder);
router.put("/changeStatus", ordersController.changeStatus);

module.exports = router;
