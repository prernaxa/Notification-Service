const amqp = require('amqplib');

let channel;

async function connectQueue() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("notifications_queue");
  return channel;
}

async function sendToQueue(data) {
  if (!channel) {
    channel = await connectQueue();
  }
  channel.sendToQueue("notifications_queue", Buffer.from(JSON.stringify(data)));
}

module.exports = { connectQueue, sendToQueue };
