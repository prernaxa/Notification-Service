const Notification = require('../models/Notification');
const redisClient = require('../utils/redisClient');

exports.createAndQueueNotification = async ({ userId, type, message, userPhone }) => {
  console.log('Creating notification with:', { userId, type, message, userPhone });
  const notification = new Notification({
    userId,
    type,
    message,
    userPhone,  // Include userPhone here for SMS
  });
  await notification.save();
  await redisClient.lpush('notificationQueue', JSON.stringify(notification));
  return notification;
};

exports.getNotificationsByUser = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};
