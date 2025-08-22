import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../../src/app';

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Setup test data
    });

    afterAll(async () => {
        // Cleanup test data
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await app.handle(
                new Request('http://localhost/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'password123',
                        name: 'Test User',
                    }),
                })
            );

            expect(response.status).toBe(201);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.user.email).toBe('test@example.com');
            expect(data.data.token).toBeDefined();
        });

        it('should fail with invalid email', async () => {
            const response = await app.handle(
                new Request('http://localhost/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'invalid-email',
                        password: 'password123',
                        name: 'Test User',
                    }),
                })
            );

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            // First register a user
            await app.handle(
                new Request('http://localhost/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'login@example.com',
                        password: 'password123',
                        name: 'Login User',
                    }),
                })
            );

            // Then try to login
            const response = await app.handle(
                new Request('http://localhost/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'login@example.com',
                        password: 'password123',
                    }),
                })
            );

            expect(response.status).toBe(200);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.user.email).toBe('login@example.com');
            expect(data.data.token).toBeDefined();
        });

        it('should fail with invalid credentials', async () => {
            const response = await app.handle(
                new Request('http://localhost/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'nonexistent@example.com',
                        password: 'wrongpassword',
                    }),
                })
            );

            expect(response.status).toBe(401);

            const data = await response.json();
            expect(data.success).toBe(false);
        });
    });
});
