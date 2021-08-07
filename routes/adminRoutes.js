const router = require("express").Router(),
  adminController = require("../controllers/adminController"),
  homeController = require("../controllers/homeController");

router.get("/", adminController.adminIndex);
router.post(
  "/add-room",
  adminController.roomValidate,
  adminController.addRoom,
  adminController.redirectView
);
router.get("/:id/edit", adminController.editRoom);
router.put(
  "/:id/update/",
  adminController.update,
  adminController.redirectView
);
router.delete(
  "/:id/delete",
  adminController.deleteRoom,
  adminController.redirectView
);
router.get("/view", adminController.viewList);
router.get("/logout", homeController.logout, adminController.redirectView);

module.exports = router;
