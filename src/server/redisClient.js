const { createClient } = require('redis');

let client;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
    console.log('✅ Connected to Redis Cloud');
  }

  return client;
}