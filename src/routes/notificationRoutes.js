const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notifications', notificationController.sendNotification);
router.get('/users/:id/notifications', notificationController.getUserNotifications);

module.exports = router;
