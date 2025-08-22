import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { appConfig } from '../config/app';

export const swaggerPlugin = new Elysia().use(
    swagger({
        documentation: {
            info: {
                title: appConfig.appName,
                version: appConfig.appVersion,
                description: appConfig.appDescription,
                contact: {
                    name: 'API Support',
                    email: 'support@example.com',
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT',
                },
            },
            servers: [
                {
                    url: `http://localhost:${appConfig.port}`,
                    description: 'Development server',
                },
            ],
            tags: [
                {
                    name: 'Authentication',
                    description: 'Authentication endpoints',
                },
                {
                    name: 'Users',
                    description: 'User management endpoints',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        exclude: ['/'],
        path: '/docs',
        swaggerOptions: {
            persistAuthorization: true,
        },
    })
);
