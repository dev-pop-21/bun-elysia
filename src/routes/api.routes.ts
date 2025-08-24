import { Elysia } from 'elysia';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { apiRateLimit } from '../plugins';

export const apiRoutes = new Elysia().use(apiRateLimit).use(authRoutes).use(userRoutes);
