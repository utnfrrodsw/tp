
import Redis from 'ioredis';

interface RedisMock {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, options?: { EX: number }) => Promise<string>;
  setex: (key: string, ttl: number, value: string) => Promise<string>;
  del: (...keys: string[]) => Promise<number>;
  keys: (pattern: string) => Promise<string[]>;
  ping: () => Promise<string>;
  quit: () => Promise<string>;
  disconnect: () => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
}

const redisUrl = process.env.REDIS_URL;

let redis: Redis | RedisMock;

if (!redisUrl) {
  console.warn('⚠️ REDIS_URL no definida, Redis no se conectará. Usando modo mock.');
  console.error('🚨 Running in Redis mock mode!');

  // Mock con métodos básicos que no hacen nada
  redis = {
    get: async (key: string) => {
      console.log(`Mock Redis GET called for key: ${key}`);
      return null;
    },
    set: async (key: string, value: string, _options?: { EX: number }) => {
      console.log(`Mock Redis SET called for key: ${key} (value length: ${value.length})`);
      return 'OK';
    },
    setex: async (key: string, ttl: number, value: string) => {
      console.log(`Mock Redis SETEX called for key: ${key} ttl: ${ttl} (value length: ${value.length})`);
      return 'OK';
    },
    del: async (...keys: string[]) => {
      console.log(`Mock Redis DEL called for keys: ${keys.join(', ')}`);
      return keys.length;
    },
    keys: async (pattern: string) => {
      console.log(`Mock Redis KEYS called for pattern: ${pattern}`);
      return [];
    },
    ping: async () => {
      console.log('Mock Redis PING called');
      return 'PONG';
    },
    quit: async () => {
      console.log('Mock Redis QUIT called');
      return 'OK';
    },
    disconnect: () => {
      console.log('Mock Redis DISCONNECT called');
    },
    on: (_event: string, _listener: (...args: any[]) => void) => {
      // No-op for mock
    },
  };
} else {
  redis = new Redis(redisUrl, {
    retryStrategy(times) {
      console.log(`Redis reconnection attempt #${times}`);
      return Math.min(times * 50, 2000);
    },
  });

  redis.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  redis.on('ready', () => {
    console.log('🔔 Redis ready to use');
  });

  redis.on('error', (err: any) => {
    console.error('❌ Redis connection error:', err);
  });

  redis.on('close', () => {
    console.warn('⚠️ Redis connection closed');
  });

  redis.on('reconnecting', () => {
    console.log('🔁 Redis reconnecting...');
  });

  redis
    .ping()
    .then(() => console.log('✅ Redis ping OK'))
    .catch(() => {
      /* noop */
    });

  const shutdown = async (signal: string) => {
    console.log(`🛑 Received ${signal} — closing Redis connection...`);
    const forceExitTimer = setTimeout(() => {
      console.warn('⏱ Redis quit timed out, forcing exit.');
      try {
        redis.disconnect();
      } catch {
        /* ignore */
      }
      process.exit(1);
    }, 5000);

    try {
      await redis.quit();
      clearTimeout(forceExitTimer);
      console.log('🛑 Redis connection closed gracefully.');
      process.exit(0);
    } catch (err: any) {
      clearTimeout(forceExitTimer);
      console.error('Error during Redis shutdown:', err);
      try {
        redis.disconnect();
      } catch {
        /* ignore */
      }
      process.exit(1);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGQUIT', () => shutdown('SIGQUIT'));
}

export default redis;
export { redis };
