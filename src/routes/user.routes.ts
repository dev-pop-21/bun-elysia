import { Elysia } from 'elysia';
import { userController } from '../controllers/user.controller';

export const userRoutes = new Elysia({ prefix: '/users' }).use(userController);
