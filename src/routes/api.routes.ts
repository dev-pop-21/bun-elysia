import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { apiRateLimit } from '../plugins';

export const apiRoutes = new Elysia({ prefix: '/api/v1' })
    .use(apiRateLimit)
    .use(authRoutes)
    .use(userRoutes);
