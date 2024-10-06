const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const adsController = require("../controllers/adsController");
const ordersController = require("../controllers/ordersController");

router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.put("/update-fcm-token", loginController.updateFcmToken);
router.post("/sendOtp", loginController.sendOtp);
router.post("/verify-otp", loginController.verifyOtp);
router.post("/change-password", loginController.changePassword);
router.post("/send-new-user-otp", loginController.sendNewUserOtp);

router.post("/users", userController.updateOrCreateUser);
router.get("/users/:id", userController.getUser);
router.get("/user/:username", userController.getUserByUsername);
router.get("/check-username", userController.checkUserName);
router.get("/userlist/:userId", userController.getUserList);
router.get("/admin/userlist", userController.getAdminUserList);
router.post("/users/details", userController.getUserDetailsByIds);
router.put("/users/:id/influencer", userController.verifyAccount);
router.post("/addReview", userController.addReview);
router.patch("/editPackage", userController.editPackage);
router.delete("/deletePackage/:id", userController.deletePackage);

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
router.put("/orders/update", ordersController.updateOrder);
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
router.put("/orders/requestedChanges", ordersController.requestedChanges);

module.exports = router;
