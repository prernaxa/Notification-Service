const Notification = require('../models/Notification');
const redisClient = require('../utils/redisClient');

exports.createAndQueueNotification = async ({ userId, type, message }) => {
  const notification = new Notification({ userId, type, message });
  await notification.save();
  await redisClient.lpush('notificationQueue', JSON.stringify(notification));
  return notification;
};

exports.getNotificationsByUser = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};