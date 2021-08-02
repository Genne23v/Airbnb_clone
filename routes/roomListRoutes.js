const router = require("express").Router(),
  roomListController = require("../controllers/roomListController");

router.get("/", roomListController.index);
router.get(
  "/logout",
  roomListController.logout,
  roomListController.redirectView
);

module.exports = router;
