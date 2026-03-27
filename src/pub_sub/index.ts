import { publicDecrypt } from "crypto";
import { createRedisClient, disconnectRedisClient } from "../connection";

async function main() {
    // -- subscriber : 구독 모드로 전환되면, 다른 명령어 사용 불가
    // -- publisher : 메시지 발행

    const subscriber = await createRedisClient();
    const publisher = await createRedisClient();

    const patternSubscriber = await createRedisClient();
    
    try {
        const channel = 'test:notification';

        subscriber.on('message', (channel, message) => {
            console.log(`Received from channel ${channel}: ${message}`);
        });

        await subscriber.subscribe(channel);
        console.log(`채널 구독 시작: ${channel}`);

        const message1 = "Hello, Redis Pub/Sub!";
        const recevers1 = await publisher.publish(channel, message1);
        console.log(`메시지 발행: ${message1} (수신자 수: ${recevers1})`);

        const message2 = "Another message for subscribers.";
        const recevers2 = await publisher.publish(channel, message1);
        console.log(`메시지 발행: ${message2} (수신자 수: ${recevers2})`);

        // 메시지가 수신될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 패턴 구독
        patternSubscriber.on('pmessage', (pattern, channel, message) => {
            console.log(`Pattern received from channel ${pattern}, ${channel}: ${message}`);
        });

        await patternSubscriber.psubscribe('news:*');
        console.log(`패턴 구독 시작: news:*`);

        await publisher.publish('news:weather', '오늘의 날씨는 맑음입니다.');
        await publisher.publish('news:sports', '오늘의 스포츠 뉴스입니다.');
        await publisher.publish('test:general', '일반 업데이트 메시지입니다.');

        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
        console.error("Error in Pub/Sub:", error);
    } finally {
        await disconnectRedisClient(subscriber);
        await disconnectRedisClient(publisher);
    }
}

main();