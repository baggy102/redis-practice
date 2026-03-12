import { createRedisClient, disconnectRedisClient } from "../connection";

async function main() {{
    const client = createRedisClient();

    try {
        await client.set('user:100:name', '배기호');
        const name = await client.get('user:100:name');
        console.log('Name: ', name);
        await client.set('user:100:name', '노진한');
        const updatedName = await client.get('user:100:name');
        console.log('Updated Name: ', updatedName);

        const none = await client.get('user:200:name');
        console.log('Non-existent Key: ', none);

        await client.incr('page_views');
        await client.incr('page_views');
        await client.incr('page_views');

        const pageViews = await client.get('page_views');
        const updatedPgeViews = await client.get('page_views')
        console.log('Updated Page Views:', updatedPgeViews);

        await client.decrby('page_views', 5);
        const decretmentdPageViews = await client.get('page_views');
        console.log('Decremented Page Views:', decretmentdPageViews);

        await client.mset(
            'user:101:name', '경문현',
            'user:101:email', 'gyeng@tetst.com'
        );

        const values = await client.mget('user:101:name', 'user:101:email');
        console.log('MGET Values: ', values);

        await client.set('sessiont:abc', 'abtice', 'EX', 300) // setex)
        const sessionTtl = await client.ttl('sessiont:abc');
        console.log('Session TTL: ', sessionTtl);

        const first = await client.setnx('config:featureX', 'enabled');
        console.log('First SETNX (should be 1):', first);

        const second = await client.setnx('config:featureX', 'disabled');
        console.log('Second SETNX (should be 0):', second);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectRedisClient(client);
    }
}}