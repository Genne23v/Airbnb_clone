const router = require("express").Router(),
  reserveController = require("../controllers/reserveController");

router.get("/:id", reserveController.index);
router.post("/:id/confirm", reserveController.validate);

module.exports = router;
