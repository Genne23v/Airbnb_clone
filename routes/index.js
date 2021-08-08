const router = require("express").Router(),
  homeRoutes = require("./homeRoutes"),
  adminRoutes = require("./adminRoutes"),
  roomListRoutes = require("./roomListRoutes"),
  reserveRoutes = require("./reserveRoutes");

router.use("/", homeRoutes);
router.use("/admin", adminRoutes);
router.use("/room-listing", roomListRoutes);
router.use("/reserve", reserveRoutes);

module.exports = router;
