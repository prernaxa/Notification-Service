const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const redisClient = require('../utils/redisClient');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailClient');
const smsService = require('../services/smsService');  // <-- Import your SMS service

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('REDIS_URL:', process.env.REDIS_URL);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/notifications')
  .then(() => {
    console.log('Worker connected to MongoDB ✅');
  })
  .catch((err) => {
    console.error('MongoDB connection error in worker ❌', err);
  });

const processNotification = async () => {
  try {
    const job = await redisClient.rpop('notificationQueue');
    if (!job) return;

    const notification = JSON.parse(job);

    try {
      if (notification.type === 'email') {
        const userEmail = notification.userId + '@example.com'; // or real email

        await sendEmail({
          to: userEmail,
          subject: 'Notification from Your App',
          text: notification.message,
        });

        console.log(`✅ Sent email to user ${notification.userId}: ${notification.message}`);
        await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });

      } else if (notification.type === 'sms') {
        // Make sure userPhone is present in notification object
        if (!notification.userPhone) {
          throw new Error('No phone number provided for SMS notification');
        }

        await smsService.send(notification.userPhone, notification.message);

        console.log(`✅ Sent SMS to user ${notification.userId} at ${notification.userPhone}: ${notification.message}`);
        await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });

      } else {
        // For in-app or other notification types
        console.log(`✅ Sent ${notification.type} to user ${notification.userId}: ${notification.message}`);
        await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });
      }
    } catch (err) {
      console.error('❌ Send failed:', err.message);

      const updated = await Notification.findById(notification._id);

      if (updated) {
        if (updated.retryCount < 3) {
          updated.retryCount += 1;
          await updated.save();
          await redisClient.lpush('notificationQueue', JSON.stringify(updated));
          console.log(`🔁 Retrying notification ${notification._id} (Attempt ${updated.retryCount})`);
        } else {
          await Notification.findByIdAndUpdate(notification._id, { status: 'failed' });
          console.log(`🚫 Notification ${notification._id} failed after 3 retries.`);
        }
      } else {
        console.warn(`⚠️ Notification with ID ${notification._id} not found in DB`);
      }
    }
  } catch (e) {
    console.error('Unhandled worker error ❗', e);
  }
};

setInterval(processNotification, 1000);
