const router = require("express").Router(),
  homeRoutes = require("./homeRoutes"),
  adminRoutes = require("./adminRoutes"),
  roomListRoutes = require("./roomListRoutes");

router.use("/", homeRoutes);
router.use("/admin", adminRoutes);
router.use("/room-listing", roomListRoutes);

module.exports = router;
