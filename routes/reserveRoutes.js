const router = require('express').Router(),
  reserveController = require('../controllers/reserveController');

router.get('/:id', reserveController.index);
router.post(
  '/:id/confirm',
  reserveController.validate,
  reserveController.checkout,
  reserveController.redirectView,
);
router.get('/:id/book', reserveController.book, reserveController.redirectView);
router.get('/:id/summary', reserveController.summaryView);
router.get(
  '/:id/logout',
  reserveController.logout,
  reserveController.redirectView,
);

module.exports = router;
