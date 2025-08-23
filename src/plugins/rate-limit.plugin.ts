import { rateLimit } from 'elysia-rate-limit';
import { appConfig } from '../config';
import { RATE_LIMIT_CONFIG } from '../utils/constants';
import { logger } from './logger.plugin';

// Helper function to create error response
const createErrorResponse = (message: string) => {
    return new Response(
        JSON.stringify({
            success: false,
            message,
            statusCode: 429,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
};

// Log rate limit exceeded (manual logging since onRateLimit is not supported)
const logRateLimit = (message: string) => {
    logger.warn('Rate limit exceeded', { message });
};

// General rate limit for all endpoints
export const generalRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.GENERAL_DURATION,
    max: appConfig.isDevelopment() ? RATE_LIMIT_CONFIG.GENERAL_MAX_DEV : RATE_LIMIT_CONFIG.GENERAL_MAX_PROD,
    errorResponse: createErrorResponse('Too many requests, please try again later'),
});

// Strict rate limit for authentication endpoints
export const authRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.AUTH_DURATION,
    max: appConfig.isDevelopment() ? RATE_LIMIT_CONFIG.AUTH_MAX_DEV : RATE_LIMIT_CONFIG.AUTH_MAX_PROD,
    errorResponse: createErrorResponse('Too many authentication attempts, please try again later'),
});

// Very strict rate limit for password reset/sensitive operations
export const sensitiveRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.SENSITIVE_DURATION,
    max: appConfig.isDevelopment() ? RATE_LIMIT_CONFIG.SENSITIVE_MAX_DEV : RATE_LIMIT_CONFIG.SENSITIVE_MAX_PROD,
    errorResponse: createErrorResponse('Too many sensitive operation attempts, please try again later'),
});

// API rate limit for general API endpoints
export const apiRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.API_DURATION,
    max: appConfig.isDevelopment() ? RATE_LIMIT_CONFIG.API_MAX_DEV : RATE_LIMIT_CONFIG.API_MAX_PROD,
    errorResponse: createErrorResponse('API rate limit exceeded, please try again later'),
});
