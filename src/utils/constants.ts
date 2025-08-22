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
    MAX_CONNECTIONS: Number(process.env.DB_MAX_CONNECTIONS) || 10,
    CONNECTION_TIMEOUT: Number(process.env.DB_CONNECTION_TIMEOUT) || 5000,
} as const;

export const CORS_CONFIG = {
    ORIGIN: process.env.CORS_ORIGIN || '*',
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    HEADERS: ['Content-Type', 'Authorization'],
    MAX_AGE: 86400,
} as const;

export const RATE_LIMIT_CONFIG = {
    MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX) || 100,
    WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
} as const;

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
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
