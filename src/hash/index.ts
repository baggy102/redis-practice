import { createRedisClient, disconnectRedisClient } from "../connection";

async function main() {
    const client = createRedisClient();

    try {
        await client.hset('user:1000', 'name', '배기호');
        await client.hset('user:1000', 'email', 'baggy@test.com', 'age', '30');

        const name = await client.hget('user:1000', 'name');
        console.log('Name:', name);

        const age = await client.hget('user:1000', 'age');
        console.log('Age:', age);

        const [name2, email, age2] = await client.hmget('user:1000', 'name', 'email', 'age');
        console.log('HMGET:', name2, email, age2);

        const allField = await client.hgetall('user:1000');
        console.log('HGETALL:', allField);

        for (const [f, v] of Object.entries(allField)) {
            console.log(`Field: ${f}, Value: ${v}`);
        }

        const hasPhone = await client.hexists('user:1000', 'phone');
        console.log('Has phone field?', hasPhone);

        const keys = await client.hkeys('user:1000');
        console.log('HKEYS:', keys);

        const values = await client.hvals('user:1000');
        console.log('HVALS:', values);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectRedisClient(client);
    }

} 

main();