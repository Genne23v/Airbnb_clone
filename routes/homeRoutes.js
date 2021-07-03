const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.post("/register", homeController.validate);
router.post("/logIn", homeController.logInValidate);

module.exports = router;
