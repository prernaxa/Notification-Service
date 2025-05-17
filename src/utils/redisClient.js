const Redis = require('ioredis');
console.log('REDIS_URL:', process.env.REDIS_URL);
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
module.exports = redisClient;
