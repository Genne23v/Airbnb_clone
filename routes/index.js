const router = require("express").Router(),
  homeRoutes = require("./homeRoutes"),
  roomListRoutes = require("./roomListRoutes");

router.use("/", homeRoutes);
router.use("/room-listing", roomListRoutes);

module.exports = router;
