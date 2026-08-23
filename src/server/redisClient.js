const { createClient } = require('redis');



export async function getRedisClient() {
  // return null;
  if (!global.redis) {
    const client = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error', err);
      throw err;
    });

    await client.connect();
    console.log('✅ Connected to Redis Cloud');
    global.redis = client;
    return client;
  }else{
    return global.redis;
  }
}
