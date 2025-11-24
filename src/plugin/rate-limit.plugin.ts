import { rateLimit, type Generator } from 'elysia-rate-limit';
import { appConfig } from '@config/app';
import { RATE_LIMIT_CONFIG } from '@util/constants';
import { logger } from './logger.plugin';

// Function to generate unique identifier for each request (using various headers)
const createGenerator: Generator = (request, server) => {
    const cfConnectingIP = request.headers.get('CF-Connecting-IP');
    const xForwardedFor = request.headers.get('X-Forwarded-For');
    const xForwardedForIndex = xForwardedFor?.split(',')[0]?.trim();
    const xRealIP = request.headers.get('X-Real-IP');
    const serverIP = server?.requestIP?.(request)?.address;
    return cfConnectingIP || xForwardedForIndex || xRealIP || serverIP || '';
};

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
    max: appConfig.isDevelopment()
        ? RATE_LIMIT_CONFIG.GENERAL_MAX_DEV
        : RATE_LIMIT_CONFIG.GENERAL_MAX_PROD,
    generator: createGenerator,
    errorResponse: createErrorResponse('Too many requests, please try again later'),
});

// Strict rate limit for authentication endpoints
export const authRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.AUTH_DURATION,
    max: appConfig.isDevelopment()
        ? RATE_LIMIT_CONFIG.AUTH_MAX_DEV
        : RATE_LIMIT_CONFIG.AUTH_MAX_PROD,
    generator: createGenerator,
    errorResponse: createErrorResponse('Too many authentication attempts, please try again later'),
});

// Very strict rate limit for password reset/sensitive operations
export const sensitiveRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.SENSITIVE_DURATION,
    max: appConfig.isDevelopment()
        ? RATE_LIMIT_CONFIG.SENSITIVE_MAX_DEV
        : RATE_LIMIT_CONFIG.SENSITIVE_MAX_PROD,
    generator: createGenerator,
    errorResponse: createErrorResponse(
        'Too many sensitive operation attempts, please try again later'
    ),
});

// API rate limit for general API endpoints
export const apiRateLimit = rateLimit({
    duration: RATE_LIMIT_CONFIG.API_DURATION,
    max: appConfig.isDevelopment() ? RATE_LIMIT_CONFIG.API_MAX_DEV : RATE_LIMIT_CONFIG.API_MAX_PROD,
    generator: createGenerator,
    errorResponse: createErrorResponse('API rate limit exceeded, please try again later'),
});
