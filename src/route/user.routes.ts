import { Elysia } from 'elysia';
import { userController } from '@controller/user.controller';

export const userRoutes = new Elysia({ prefix: '/users' }).use(userController);
