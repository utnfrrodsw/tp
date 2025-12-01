import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

console.log('🧪 Setting up backend tests...');

// Ensure env vars BEFORE any app imports
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-dummy-key';

// Mock MikroORM completely before any imports
vi.mock('@mikro-orm/core', () => ({
  // Entity decorators
  PrimaryKey: () => () => {},
  Property: () => () => {},
  Entity: () => () => {},
  ManyToOne: () => () => {},
  OneToMany: () => () => {},
  ManyToMany: () => () => {},
  OneToOne: () => () => {},
  Unique: () => () => {},
  Index: () => () => {},
  Enum: () => () => {},
  Formula: () => () => {},
  BeforeCreate: () => () => {},
  BeforeUpdate: () => () => {},
  AfterCreate: () => () => {},
  AfterUpdate: () => () => {},

  // Cascade options
  Cascade: {
    ALL: 'all',
    PERSIST: 'persist',
    MERGE: 'merge',
    REMOVE: 'remove',
    REFRESH: 'refresh',
    DETACH: 'detach',
  },

  // Query operators
  QueryOrder: {
    ASC: 'asc',
    DESC: 'desc',
  },

  // Flush modes
  FlushMode: {
    AUTO: 'auto',
    ALWAYS: 'always',
    COMMIT: 'commit',
  },

  // Lock modes
  LockMode: {
    NONE: 'none',
    OPTIMISTIC: 'optimistic',
    PESSIMISTIC_READ: 'pessimistic_read',
    PESSIMISTIC_WRITE: 'pessimistic_write',
  },

  // Request context
  RequestContext: {
    create: vi.fn((em, next) => next()),
  },

  // Entity manager and repository
  EntityManager: vi.fn(),
  EntityRepository: vi.fn(),

  // Collection
  Collection: class MockCollection {
    constructor() {
      this.items = [];
    }
    add = vi.fn();
    remove = vi.fn();
    contains = vi.fn();
    get = vi.fn();
    toArray = vi.fn(() => this.items);
  },

  // Wrap and Reference
  wrap: vi.fn((entity) => entity),
  Reference: {
    create: vi.fn(),
  },

  // Base entity
  BaseEntity: class MockBaseEntity {},

  // Types
  Type: {
    DATETIME: 'datetime',
    DATE: 'date',
    TIME: 'time',
    JSON: 'json',
    TEXT: 'text',
    BOOLEAN: 'boolean',
    INTEGER: 'integer',
    FLOAT: 'float',
    DECIMAL: 'decimal',
    STRING: 'string',
    ENUM: 'enum',
    BLOB: 'blob',
  },

  // LoadStrategy
  LoadStrategy: {
    SELECT_IN: 'select-in',
    JOINED: 'joined',
  },

  // EventSubscriber decorator
  EventSubscriber: () => () => {},

  // Migration
  Migration: class MockMigration {},

  // Query builder
  QueryBuilder: class MockQueryBuilder {},

  // Platform
  Platform: class MockPlatform {},

  // Schema generator
  SchemaGenerator: class MockSchemaGenerator {},
}));

// Mock MikroORM MySQL
vi.mock('@mikro-orm/mysql', () => ({
  MikroORM: {
    init: vi.fn().mockResolvedValue({
      em: {
        fork: vi.fn().mockReturnValue({
          getConnection: vi.fn().mockReturnValue({
            execute: vi.fn().mockResolvedValue([{ result: 1 }]),
          }),
          findOne: vi.fn(),
          findAll: vi.fn(),
          persistAndFlush: vi.fn(),
          removeAndFlush: vi.fn(),
          getRepository: vi.fn(),
        }),
      },
      getSchemaGenerator: vi.fn().mockReturnValue({
        ensureDatabase: vi.fn(),
        updateSchema: vi.fn(),
        refreshDatabase: vi.fn(),
      }),
      close: vi.fn(),
    }),
  },
}));

// Mock your ORM module
vi.mock('../src/shared/db/orm.js', () => ({
  orm: {
    em: {
      fork: vi.fn().mockReturnValue({
        getConnection: vi.fn().mockReturnValue({
          execute: vi.fn().mockResolvedValue([{ result: 1 }]),
        }),
        findOne: vi.fn(),
        findAll: vi.fn(),
        persistAndFlush: vi.fn(),
        removeAndFlush: vi.fn(),
        getRepository: vi.fn(),
      }),
    },
    getSchemaGenerator: vi.fn().mockReturnValue({
      ensureDatabase: vi.fn(),
      updateSchema: vi.fn(),
    }),
    close: vi.fn(),
  },
  syncSchema: vi.fn().mockResolvedValue(undefined),
}));

// Mock cron manager
vi.mock('../src/shared/cron/cronManager.js', () => ({
  CronManager: {
    initializeAll: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock reflect-metadata
vi.mock('reflect-metadata', () => ({}));

// Global test setup
beforeAll(async () => {
  console.log('🔧 Global test setup started');
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DB_URL = 'mysql://test:test@localhost:3306/test_db';
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-dummy-key';
});

afterAll(async () => {
  console.log('🔧 Global test cleanup completed');
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Mock external dependencies that might cause issues in tests
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('mocked-hash'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('mocked-hash'),
  compare: vi.fn().mockResolvedValue(true),
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mocked-token'),
    verify: vi.fn().mockReturnValue({ id: 1, mail: 'test@test.com' }),
  },
  sign: vi.fn().mockReturnValue('mocked-token'),
  verify: vi.fn().mockReturnValue({ id: 1, mail: 'test@test.com' }),
}));

// Mock nodemailer - FIX: Add default export
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
      verify: vi.fn().mockResolvedValue(true),
    }),
  },
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    verify: vi.fn().mockResolvedValue(true),
  }),
}));

// Mock stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  })),
}));

// Add this mock BEFORE any code that might import your service
vi.mock('openai', () => {
  return {
    default: class OpenAI {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'mocked-response' } }],
          }),
        },
      };
    },
  };
});

console.log('✅ Test setup complete');
