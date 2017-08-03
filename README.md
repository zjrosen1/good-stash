# good-stash

`good-stash` is a transform stream for sending events to redis logstash

## Usage

```
plugin: {
  register: 'good',
  options: {
    ops: {
      interval: 1000,
    },
    reporters: {
      bugsnag: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: 'error',
              error: '*',
              request: 'error',
            },
          ],
        },
        {
          module: 'good-stash',
          args: [
            {
              redisHost: '127.0.0.1',
              redisPort: 6379,
              redisKey: 'REDIS_KEYSPACE_HERE',
            },
          ],
        },
      ],
    },
  },
},
```
