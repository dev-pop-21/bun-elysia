import { Elysia } from 'elysia';
import { apiRateLimit } from '@plugin/rate-limit.plugin';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

export const apiRoutes = new Elysia().use(apiRateLimit).use(authRoutes).use(userRoutes);
