const router = require("express").Router(),
  adminController = require("../controllers/adminController"),
  homeController = require("../controllers/homeController");
//to update master
router.get("/", adminController.index);
router.post(
  "/add-room",
  adminController.roomValidate,
  adminController.addRoom,
  adminController.redirectView
);
router.get("/update-room", adminController.editRoom);
router.put(
  "/update-room/update",
  adminController.update,
  adminController.redirectView
);
router.delete(
  "/remove-room",
  adminController.deleteRoom,
  adminController.redirectView
);
router.get("/view", adminController.viewList);
router.get("/logout", homeController.logout, adminController.redirectView);

module.exports = router;
