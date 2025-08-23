import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import type { ElysiaSwaggerConfig } from '@elysiajs/swagger';
import { appConfig } from '../config/app';

export const swaggerPlugin = (app: Elysia) => {
    const options: ElysiaSwaggerConfig = {
        documentation: {
            info: {
                title: appConfig.appName,
                version: appConfig.appVersion,
                description: appConfig.appDescription,
                contact: {
                    name: 'API Support',
                    email: 'likit.p@softnix.co.th',
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT',
                },
            },
            tags: [],
            servers: [],
            security: [{ Bearer: [] }],
            components: {
                securitySchemes: {
                    Bearer: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'JWT Bearer token for API authentication',
                    },
                },
            },
        },
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            tryItOutEnabled: true,
            filter: true,
            deepLinking: true,
        },
    };
    return app
        .use(
            swagger({
                ...options,
                path: '/swagger',
                exclude: [/swagger.*/],
                provider: 'swagger-ui',
            })
        )
        .use(
            swagger({
                ...options,
                path: '/docs',
                exclude: [/docs.*/],
                provider: 'scalar',
            })
        );
};
