const notificationService = require('../services/notificationService');

exports.sendNotification = async (req, res) => {
  try {
    const notification = await notificationService.createAndQueueNotification(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.params.id);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
