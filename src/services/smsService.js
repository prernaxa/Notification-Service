const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

exports.send = async (to, message) => {
  try {
    const res = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log(`✅ SMS sent to ${to}: ${res.sid}`);
    return res;
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${to}:`, error.message);
    throw error;
  }
};
