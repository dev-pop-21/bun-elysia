import { Elysia } from 'elysia';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { logConfig } from '../config';

// Custom log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(info => {
        const { timestamp = '', level = '', message = '', duration = '' } = info;
        return `${timestamp} ${level} : ${message} ${duration}`;
    })
);

// Create Winston logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'bun-elysia' },
    transports: [
        // Daily rotate file for combined logs
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: logConfig.maxFiles,
            maxSize: logConfig.maxSize,
            datePattern: logConfig.datePattern,
            zippedArchive: logConfig.zippedArchive,
            auditFile: logConfig.auditFile.replace('.json', '-combined.json'),
        }),
        // Daily rotate file for error logs
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: logConfig.maxFiles,
            maxSize: logConfig.maxSize,
            datePattern: logConfig.datePattern,
            zippedArchive: logConfig.zippedArchive,
            auditFile: logConfig.auditFile.replace('.json', '-error.json'),
        }),
    ],
});

// If we're not in production then log to the console with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: logFormat,
        })
    );
}

// Logger plugin for Elysia
export const loggerPlugin = (app: Elysia) =>
    app
        .decorate('logger', logger)
        .onRequest((handler: any) => {
            const { request, server } = handler;
            const method = request.method;
            const url = request.url;
            const user = request.headers.get('user') || '';
            const cfConnectingIP = request.headers.get('CF-Connecting-IP');
            const xForwardedFor = request.headers.get('X-Forwarded-For');
            const xForwardedForIndex = xForwardedFor?.split(',')[0]?.trim();
            const xRealIP = request.headers.get('X-Real-IP');
            const serverIP = server?.requestIP?.(request)?.address;
            const ip = cfConnectingIP || xForwardedForIndex || xRealIP || serverIP || '';
            const timestamp = new Date().toISOString();
            const request_id = crypto.randomUUID();
            handler.info = {
                ip,
                method,
                url,
                user,
                timestamp,
                request_id,
            };
            logger.info('Incoming request', handler.info);
            // Store start time for response logging
            handler.request.startTime = Date.now();
        })
        .onAfterHandle((handler: any) => {
            const { request, response, info } = handler;
            const duration = `${Date.now() - (request?.startTime || Date.now())}ms`;
            const status = response?.status || 200;
            const logLevel = status >= 400 ? 'error' : 'info';
            const timestamp = new Date().toISOString();
            handler.info = {
                ...info,
                status,
                timestamp,
                duration,
            };
            logger[logLevel]('Request completed', handler.info);
        })
        .onError((handler: any) => {
            const { error, request, info } = handler;
            const duration = `${Date.now() - (request?.startTime || Date.now())}ms`;
            const message = (error instanceof Error && error?.message) || String(error);
            const stack = error instanceof Error && error.stack || '';
            const timestamp = new Date().toISOString();
            handler.info = {
                ...info,
                error: message,
                stack: stack,
                timestamp,
                duration,
            };
            logger.error('Request error', handler.info);
        });

// Export the winston logger instance for use in other parts of the application
export { logger };

// Export logger types for better TypeScript support
export type Logger = typeof logger;
