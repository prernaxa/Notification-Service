const notificationService = require('../services/notificationService');
const smsService = require('../services/smsService'); // or wherever your smsService is located

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, message, userPhone } = req.body;

    if (type === 'sms') {
      if (!userPhone) {
        return res.status(400).json({ error: 'userPhone is required for SMS notifications' });
      }

  
      await smsService.send(userPhone, message);

      
      const notification = await notificationService.createAndQueueNotification({
        userId,
        type,
        message,
        userPhone,
        status: 'sent',
      });

      return res.status(201).json(notification);
    }

    
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
