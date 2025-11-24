import { Elysia, t } from 'elysia';
import { AuthService } from '../service/auth.service';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

export const authController = new Elysia()
    .post(
        '/login',
        async ({ body, set }) => {
            try {
                const result = await AuthService.login(body as LoginRequest);
                return {
                    success: true,
                    data: result,
                    message: 'Login successful',
                };
            } catch (error) {
                set.status = 401;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Login failed',
                };
            }
        },
        {
            body: t.Object({
                email: t.String({ format: 'email' }),
                password: t.String({ minLength: 6 }),
            }),
        }
    )

    .post(
        '/register',
        async ({ body, set }) => {
            try {
                const result = await AuthService.register(body as RegisterRequest);
                set.status = 201;
                return {
                    success: true,
                    data: result,
                    message: 'Registration successful',
                };
            } catch (error) {
                set.status = 400;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Registration failed',
                };
            }
        },
        {
            body: t.Object({
                email: t.String({ format: 'email' }),
                password: t.String({ minLength: 6 }),
                name: t.String({ minLength: 2 }),
            }),
        }
    )

    .post('/logout', ({ set }) => {
        return {
            success: true,
            message: 'Logout successful',
        };
    });
