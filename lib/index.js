'use strict';

const _             = require('lodash');
const Os            = require('os');
const Stringify     = require('fast-safe-stringify');
const LogstashRedis = require('logstash-redis');
const Hoek          = require('hoek');
const Stream        = require('stream');

const internals = {
  defaults: {
    config: {
      redisHost: '127.0.0.1',
      redisPort: 6379,
    },
  },
};

class GoodStash extends Stream.Writable {
  constructor(config = {}) {
    Hoek.assert(config.redisKey, 'redisKey must exist.')

    const settings = Hoek.applyToDefaults(internals.defaults.config, config);

    super({ objectMode: true });

    this.logger = LogstashRedis.createLogger(settings.redisHost, settings.redisPort, settings.redisKey, {
      host: Os.hostname(),
    });

    this.once('finish', () => {
      this._write();
    });
  }

  _write(data, encoding, next) {
    this.logger.log(this.format(data), next);
  }

  format(message) {
    if (message.data instanceof Error) {
      const error = {
        name: message.data.name,
        message : message.data.message,
        stack: message.data.stack
      }

      if (message.data.isBoom) {
        error.statusCode = message.data.output.statusCode;
        error.data = message.data.data
      }

      message.error = Object.assign({}, error);
      delete message.data;
    }

    return Stringify(message);
  }
}

module.exports = GoodStash;
