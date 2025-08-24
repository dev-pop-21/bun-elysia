import { Elysia } from 'elysia';
import { authController } from '../controllers/auth.controller';
import { authRateLimit } from '../plugins';

export const authRoutes = new Elysia({ prefix: '/auth' }).use(authRateLimit).use(authController);
