import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { CORS_CONFIG } from '../utils/constants';

export const corsPlugin = (app: Elysia) =>
    app.use(
        cors({
            origin: CORS_CONFIG.ORIGIN,
            methods: CORS_CONFIG.METHODS as any,
            allowedHeaders: CORS_CONFIG.HEADERS as any,
            maxAge: CORS_CONFIG.MAX_AGE,
            credentials: true,
        })
    );
