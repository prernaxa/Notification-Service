const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: String,
  type: { type: String, enum: ['email', 'sms', 'in-app'], required: true },
  message: String,
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  retryCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);

