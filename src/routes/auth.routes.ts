import { Elysia } from 'elysia';
import { authController } from '../controllers/auth.controller';

export const authRoutes = new Elysia({ prefix: '/auth' }).use(authController);
