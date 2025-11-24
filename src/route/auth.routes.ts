import { Elysia } from 'elysia';
import { authController } from '@controller/auth.controller';
import { authRateLimit } from '@plugin/rate-limit.plugin';

export const authRoutes = new Elysia({ prefix: '/auth' }).use(authRateLimit).use(authController);
