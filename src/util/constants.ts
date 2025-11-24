export const APP_CONFIG = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_VERSION: 'v1',
    API_PREFIX: '/api',
} as const;

export const JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    ALGORITHM: 'HS256',
} as const;

export const DATABASE_CONFIG = {
    URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/bun_elysia',
    DATABASE_NAME: process.env.DATABASE_NAME || 'mydb',
    MAX_POOL_SIZE: Number(process.env.DB_MAX_POOL_SIZE) || 10,
    SERVER_SELECTION_TIMEOUT_MS: Number(process.env.DB_SERVER_SELECTION_TIMEOUT_MS) || 5000,
} as const;

export const CORS_CONFIG = {
    ORIGIN: process.env.CORS_ORIGIN || '*',
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    HEADERS: ['Content-Type', 'Authorization'],
    MAX_AGE: 86400,
} as const;

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

export const LOG_CONFIG = {
    MAX_FILES: process.env.LOG_MAX_FILES || '14d',
    MAX_SIZE: process.env.LOG_MAX_SIZE || '20m',
    DATE_PATTERN: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
    ZIPPED_ARCHIVE: process.env.LOG_ZIPPED_ARCHIVE === 'true' || true,
    AUDIT_FILE: process.env.LOG_AUDIT_FILE || 'logs/audit.json',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

export const SYSLOG_CONFIG = {
    HOST: process.env.SYSLOG_HOST || 'localhost',
    PORT: Number(process.env.SYSLOG_PORT) || 514,
    PROTOCOL: (process.env.SYSLOG_PROTOCOL as 'udp4' | 'udp6' | 'tcp4' | 'tcp6') || 'udp4',
    FACILITY: process.env.SYSLOG_FACILITY || 'local0',
    APP_NAME: process.env.SYSLOG_APP_NAME || 'bun-elysia',
    ENABLED: process.env.SYSLOG_ENABLED === 'true' || false,
} as const;

export const RATE_LIMIT_CONFIG = {
    // General rate limit (applied to all endpoints)
    GENERAL_DURATION: Number(process.env.RATE_LIMIT_GENERAL_DURATION) || 60000, // 1 minute
    GENERAL_MAX_PROD: Number(process.env.RATE_LIMIT_GENERAL_MAX_PROD) || 100,
    GENERAL_MAX_DEV: Number(process.env.RATE_LIMIT_GENERAL_MAX_DEV) || 1000,

    // API rate limit (applied to /api/v1/* endpoints)
    API_DURATION: Number(process.env.RATE_LIMIT_API_DURATION) || 60000, // 1 minute
    API_MAX_PROD: Number(process.env.RATE_LIMIT_API_MAX_PROD) || 200,
    API_MAX_DEV: Number(process.env.RATE_LIMIT_API_MAX_DEV) || 500,

    // Auth rate limit (applied to /api/v1/auth/* endpoints)
    AUTH_DURATION: Number(process.env.RATE_LIMIT_AUTH_DURATION) || 60000, // 1 minute
    AUTH_MAX_PROD: Number(process.env.RATE_LIMIT_AUTH_MAX_PROD) || 5,
    AUTH_MAX_DEV: Number(process.env.RATE_LIMIT_AUTH_MAX_DEV) || 20,

    // Sensitive operations rate limit
    SENSITIVE_DURATION: Number(process.env.RATE_LIMIT_SENSITIVE_DURATION) || 300000, // 5 minutes
    SENSITIVE_MAX_PROD: Number(process.env.RATE_LIMIT_SENSITIVE_MAX_PROD) || 3,
    SENSITIVE_MAX_DEV: Number(process.env.RATE_LIMIT_SENSITIVE_MAX_DEV) || 10,

    // Global settings
    ENABLED: process.env.RATE_LIMIT_ENABLED !== 'false', // Enabled by default
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    INVALID_TOKEN: 'Invalid or expired token',
} as const;
