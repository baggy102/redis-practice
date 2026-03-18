import { createRedisClient, disconnectRedisClient } from "../connection";

async function main() {
    const client = createRedisClient();

    try {
        await client.zadd('leaderboard', 100, 'Alice');
        await client.zadd('leaderboard', 95, 'Bob', 150, 'Charlie', 85, 'Dave');

        const all = await client.zrange('leaderboard', 0, -1, 'WITHSCORES');
        console.log('ZRANGE:', all);

        // ZADD 옵션
        const nxResult = await client.zadd('leaderboard', 'NX', 200, 'Eve');
        const nxResult2 = await client.zadd('leaderboard', 'NX', 999, 'Alice');
        console.log('ZADD NX Resultsl:', nxResult, nxResult2);

        const xxResult = await client.zadd('leaderboard', 'XX', 150, 'Alice');
        const xxResult2 = await client.zadd('leaderboard', 'XX', 300, 'Frank');
        console.log('ZADD XX Results:', xxResult, xxResult2);

        const aliceScore1 = await client.zscore('leaderboard', 'Alice');
        await client.zadd('leaderboard', 'GT', 180, 'Alice');
        const aliceScore2 = await client.zscore('leaderboard', 'Alice');
        console.log('Alice Scores (GT):', aliceScore1, aliceScore2);

        const bottom3 = await client.zrange('leaderboard', 0, 2, 'WITHSCORES');
        console.log('Bottom 3 ZRAGE:', bottom3);

        const top3 = await client.zrevrange('leaderboard', 0, 2, 'WITHSCORES');
        console.log('Top 3 ZREVRANGE:', top3);

        // 6.2 + 버전, ZRANGE에 REV 옵션 추가
        const top3L_v62 = await client.zrange('leaderboard', 0, 2, 'REV', 'WITHSCORES');
        console.log('Top 3 ZRANGE with REV (v6.2+):', top3L_v62); 

        const rankAsc = await client.zrank('leaderboard', 'Alice');
        console.log('Alice Rank (ASC):', rankAsc);

        const rankDesc = await client.zrevrank
        console.log('Alice Rank (DESC):', rankDesc);

        const newScore = await client.zincrby('leaderboard', 30, 'Bob');
        console.log('Bob New Score after ZINCRBY:', newScore);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectRedisClient(client);
    }
}

main();