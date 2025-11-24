import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { apiRateLimit } from '@plugin/rate-limit.plugin';

export const apiRoutes = new Elysia().use(apiRateLimit).use(authRoutes).use(userRoutes);
