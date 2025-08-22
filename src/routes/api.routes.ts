import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

export const apiRoutes = new Elysia({ prefix: '/api/v1' })
    .use(authRoutes)
    .use(userRoutes);
