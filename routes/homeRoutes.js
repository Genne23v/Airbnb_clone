const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.post(
  "/register",
  homeController.validate,
  homeController.create,
  homeController.sendEmail
);
router.post("/logIn", homeController.logInValidate);
router.get("/logOut", homeController.logout, homeController.redirectView);
router.get("/admin", homeController.index);

module.exports = router;
