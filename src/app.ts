import { Elysia } from 'elysia';
import { corsPlugin, swaggerPlugin, loggerPlugin, logger, generalRateLimit } from './plugins';
import { apiRoutes } from './routes';
import { appConfig } from './config';
import { DatabaseService } from './services';
import { RATE_LIMIT_CONFIG } from './utils/constants';

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
    .all('*', ({ set }) => {
        set.status = 404;
        return {
            success: false,
            message: 'Route not found',
            statusCode: 404,
        };
    })

    // Global error handler
    .onError(({ error, set }) => {
        const message = error instanceof Error ? error.message : 'Internal server error';
        logger.error('Global error', {
            message,
            stack: error instanceof Error ? error.stack : undefined,
        });

        set.status = 500;
        return {
            success: false,
            message: 'Internal server error',
            error: appConfig.isDevelopment() ? message : undefined,
            statusCode: 500,
        };
    });

// Initialize database connection
if (appConfig.nodeEnv !== 'test') {
    DatabaseService.getInstance().connect().catch(console.error);
}
