1. KEYS pattern
    -> KEYS *
    -> KEYS user:* -> user:a, user:b, user:test:1
    -> KEYS user:[123]* -> user:1, user:2, user:3
    -> KEYS user:[a-z]* -> user: 다음에 오는 소문자 알파벳
    -> KEYS user:/* -> user:*라는 literal 문자열과 매치

- KEYS : 패턴 매칭
  전체 키 한번에 조회
  서버 블로킹 (레디스 자체가 싱글스레드로 동작, 명령어 실행 동안 다른 명령어는 대기해야함.
  KEYS는 수백~수백만 로드 할 동안 대기,
  production 환경에서는 사용을 삼가해야 함.)

2. SCAN cursor [pattern] [count] [type]
    : 커서 기반으로 일부씩 나눠 키들을 반환
    -> SCAN 0 : [17, [key1, key2, key3]]
    -> SCAN 17 : ~~
    -> SCAN <> : [0, [key10, key11]]

3. EXISTS key [key ...]
    : 지정한 키가 존재하는지 확인
    -> EXISTS user:1000
    -> EXISTS user:1000 user:2000
    -> EXISTS mykey mykey mykey // 이 경우도 가능 존재하면 3
    