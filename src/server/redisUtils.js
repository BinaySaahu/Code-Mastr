export async function addDataToRedis(key, value, expirationInSeconds, client) {
    await client.set(key, value, { EX: expirationInSeconds });
}

export async function getDataFromRedis(key, client) {
    return await client.get(key);
}

export async function deleteDataFromRedis(key, client) {
    return await client.del(key);
}