const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.post('/book', ctrl.bookRooms);
router.post('/reset', ctrl.resetRooms);
router.post('/random', ctrl.generateOccupancy);
router.get('/rooms', ctrl.getAllRooms);

module.exports = router;