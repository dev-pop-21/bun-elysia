import { Elysia } from 'elysia';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// @ts-ignore
import { Syslog } from 'winston-syslog';
import { logConfig, syslogConfig } from '@config/logger';

// Custom log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(info => {
        const { timestamp = '', ip = '', level = '', message = '', duration = '' } = info;
        return `timestamp:[${timestamp}]-ip:[${ip}]-level[${level}]-message:[${message}] ${duration}`;
    })
);

// Syslog format
const syslogFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.errors({ stack: true }),
    format.json()
);

// Create transport array
const transports: winston.transport[] = [
    // Daily rotate file for combined logs
    new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        format: format.combine(format.timestamp(), format.json()),
        maxFiles: logConfig.maxFiles,
        maxSize: logConfig.maxSize,
        datePattern: logConfig.datePattern,
        zippedArchive: logConfig.zippedArchive,
        auditFile: logConfig.auditFile.replace('.json', '-combined-audit.json'),
    }),
    // Daily rotate file for warn logs
    new DailyRotateFile({
        filename: 'logs/warn-%DATE%.log',
        level: 'warn',
        format: format.combine(format.timestamp(), format.json()),
        maxFiles: logConfig.maxFiles,
        maxSize: logConfig.maxSize,
        datePattern: logConfig.datePattern,
        zippedArchive: logConfig.zippedArchive,
        auditFile: logConfig.auditFile.replace('.json', '-warn-audit.json'),
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
        auditFile: logConfig.auditFile.replace('.json', '-error-audit.json'),
    }),
];

// Add syslog transport if enabled
if (syslogConfig.enabled) {
    try {
        transports.push(
            new Syslog({
                host: syslogConfig.host,
                port: syslogConfig.port,
                protocol: syslogConfig.protocol,
                facility: syslogConfig.facility,
                app_name: syslogConfig.appName,
                format: syslogFormat,
            })
        );
        console.log(
            `Syslog transport enabled - ${syslogConfig.host}:${syslogConfig.port} (${syslogConfig.protocol})`
        );
    } catch (error) {
        console.error('Failed to initialize syslog transport:', error);
    }
}

// Create Winston logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'bun-elysia' },
    transports,
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
            const request_id = crypto.randomUUID();
            const timestamp = new Date().toISOString();
            handler.info = {
                request_id,
                ip,
                method,
                url,
                user,
                timestamp,
            };
            logger.info('Incoming request', handler.info);
            // Store start time for response logging
            handler.request.startTime = Date.now();
        })
        .onAfterHandle((handler: any) => {
            const { request, response, info } = handler;
            const duration = `${Date.now() - (request?.startTime || Date.now())}ms`;
            const status = response?.status || 200;
            const timestamp = new Date().toISOString();
            handler.info = {
                ...info,
                status,
                timestamp,
                duration,
            };
            const level = status >= 400 ? 'error' : 'info';
            logger[level]('Request completed', handler.info);
        })
        .onError((handler: any) => {
            const { error, request, info } = handler;
            const duration = `${Date.now() - (request?.startTime || Date.now())}ms`;
            const message = (error instanceof Error && error?.message) || String(error);
            const stack = (error instanceof Error && error.stack) || '';
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
