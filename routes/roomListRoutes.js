const router = require("express").Router(),
  roomListController = require("../controllers/roomListController");

router.get("/", roomListController.index);

module.exports = router;
