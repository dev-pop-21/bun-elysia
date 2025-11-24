import { Elysia } from 'elysia';
import { corsPlugin } from '@plugin/cors.plugin';
import { swaggerPlugin } from '@plugin/swagger.plugin';
import { loggerPlugin, logger } from '@plugin/logger.plugin';
import { generalRateLimit } from '@plugin/rate-limit.plugin';
import { apiRoutes } from '@route/api.routes';
import { appConfig } from '@config/app';
import { DatabaseService } from '@service/database.service';
import { RATE_LIMIT_CONFIG } from '@util/constants';

export const app = new Elysia()
    // Global middlewares
    .use(swaggerPlugin)
    .use(corsPlugin)
    .use(loggerPlugin)

    // Rate limiting (conditionally applied)
    .use(RATE_LIMIT_CONFIG.ENABLED ? generalRateLimit : new Elysia())

    // Health check endpoints
    .get('/', () => ({
        message: `Welcome to ${appConfig.appName}`,
        version: appConfig.appVersion,
        environment: appConfig.nodeEnv,
        timestamp: new Date().toISOString(),
    }))

    .get('/health', async () => {
        const database = DatabaseService.getInstance();

        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: appConfig.appVersion,
            environment: appConfig.nodeEnv,
            services: {
                database: database.isHealthy() ? 'healthy' : 'unhealthy',
            },
        };
    })

    // API routes
    .use(apiRoutes)

    // 404 handler
    .all('*', (handler: any) => {
        const { set, info } = handler;
        set.status = 404;
        handler.info = {
            ...info,
            status: set.status,
        };
        logger.warn('404 Not Found', handler.info);
        return {
            success: false,
            message: 'Route not found',
            status: set.status,
        };
    })

    // Global error handler
    .onError((handler: any) => {
        const { error, set, info } = handler;
        const message = error instanceof Error ? error.message : 'Internal server error';
        const stack = error instanceof Error ? error.stack : undefined;
        set.status = 500;
        handler.info = {
            ...info,
            message,
            stack,
            status: set.status,
        };
        logger.error('Global error', handler.info);
        return {
            success: false,
            message: 'Internal server error',
            error: appConfig.isDevelopment() ? message : undefined,
            status: set.status,
        };
    });

// Initialize database connection
if (appConfig.nodeEnv !== 'test') {
    DatabaseService.getInstance().connect().catch(console.error);
}
