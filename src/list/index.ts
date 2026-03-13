import { createRedisClient, disconnectRedisClient } from "../connection";

async function main () {
    const client = createRedisClient();

    try {
        await client.rpush('mylis', 'first');
        await client.rpush('mylis', 'second');

        const list1 = await client.lrange('mylis', 0, -1);
        console.log('List Length:', list1.length);
        console.log('List Elements:', list1);

        await client.lpush('mylis', 'zero');
        const list2 = await client.lrange('mylis', 0, -1);
        console.log('After LPUSH, List Elements:', list2);

        const firstElement = await client.lpop('mylis');
        console.log('LPOP Ellement:', firstElement);

        const list3 = await client.lrange('mylis', 0, 1);
        console.log('LPOP Elements:', list3);

        const lastElement = await client.rpop('mylis');
        console.log('RPOP Element:', lastElement);

        const list4 = await client.lrange('mylist', 0, -1);
        console.log('After RPOP, List Elements:', list4);

        const multiItems = await client.lpop('mylist', 2);
        console.log('LPOP Multiple Items:', multiItems);

        const finalList = await client.lrange('mylist', 0, -1);
        console.log('Final List Elements:', finalList);

        // Queue: RPUSH + LPOP
        await client.del('task_queue');
        await client.rpush('task_queue', 'task1', 'task2', 'task3');

        const task1 = await client.lpop('task_queue');
        console.log('Processing Task:', task1);

        const task2 = await client.lpop('task_queue');
        console.log('Processing Task:', task2);

        const task3 = await client.lpop('task_queue');
        console.log('Processing Task:', task3);

        // Stack : LPUSH + LPOP

        // Blocking Pop
        await client.del('async_queue');

        setTimeout(async () => {
            await client.rpush('async_queue', 'async_task1');
            console.log('Added async_task1 to async_queue');
        }, 3000);

        const producerClient = createRedisClient();
        // BLPOP > blocking 된 상태에서 list를 pop 하는 명령어
        // 같은 클라이언트에서 BLPOP을 호출하면, 
        // 해당 클라이언트는 블로킹 상태 
        // 따라서 별도의 클라이언트를 생성하여 BLPOP을 호출
        // 동일 클라이언트의 경우에 위 setTimeout의 노드 이벤트 루프는 수행
        // 하지만 BLPOP이 블로킹 상태이므로, setTimeout의 콜백이 실행되지 않음

        const result = await producerClient.blpop('async_queue', 5); // 블로킹 대기 5초
        if (result) {
            console.log('BLPOP Result:', result);
        } else {
            console.log('BLPOP timed out without receiving an item.');
        }

        disconnectRedisClient(producerClient);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await disconnectRedisClient(client);
    }
}

main();