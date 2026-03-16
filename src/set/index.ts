import { createRedisClient, disconnectRedisClient } from "../connection";

async function main () {
    const client = createRedisClient();

    try {

        await client.sadd('fruits', 'apple');
        await client.sadd('fruits', 'apple');
        await client.sadd('fruits', 'banana', 'orange');

        const allFruits = await client.smembers('fruits');
        console.log('All fruits in the set:', allFruits);

        const isAppleMember = await client.sismember('fruits', 'apple');
        console.log('Is apple a member of the set?', isAppleMember === 1 ? 'Yes' : 'No');
        
        const isGrapeMember = await client.sismember('fruits', 'grape');
        console.log('Is grape a member of the set?', isGrapeMember === 1 ? 'Yes' : 'No');

        const size = await client.scard('fruits');
        console.log('Number of fruits in the set:', size);

        await client.srem('fruits', 'apple');

        const afterRemove = await client.smembers('fruits');
        console.log('Fruits after removing apple:', afterRemove);

        const poppedFruit = await client.spop('fruits');
        console.log('Randomly popped fruit:', poppedFruit);

        const afterPop = await client.smembers('fruits');
        console.log('Fruits after popping a random fruit:', afterPop);

        // -------------------------------

        await client.sadd('nunber', '1', '2', '3', '4', '5');

        const random = await client.srandmember('nunber');
        console.log('Two random members from the set:', random);

        const randomMultiple = await client.srandmember('nunber', 3);
        console.log('Three random members from the set:', randomMultiple);

        // ------------------------------- 게시글 좋아요 시스템 구성

        await client.sadd('post:1:likes', 'user1', 'user2', 'user3');
        const likeCount = await client.scard('post:1:likes');
        console.log('Number of likes for post 1:', likeCount);

        const hasUser2Liked = await client.sismember('post:1:likes', 'user2');
        console.log('Has user2 liked post 1?', hasUser2Liked === 1 ? 'Yes' : 'No');

        await client.sadd('postL1:likes', 'user1');

        await client.srem('post:1:likes', 'user2');
        const likesCountAfterUnlike = await client.scard('post:1:likes');
        console.log('Number of likes for post 1 after user2 unliked:', likesCountAfterUnlike);     

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectRedisClient(client);
    }
}

main();
