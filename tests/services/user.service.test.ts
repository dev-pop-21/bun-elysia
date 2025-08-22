import { describe, it, expect, beforeAll } from 'bun:test';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
    beforeAll(async () => {
        // Setup test data
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = {
                email: 'service@example.com',
                name: 'Service User',
                password: 'hashedpassword123',
            };

            const user = await UserService.createUser(userData);

            expect(user.email).toBe(userData.email);
            expect(user.name).toBe(userData.name);
            expect(user.id).toBeDefined();
            expect(user.password).toBeUndefined(); // Should not return password
        });
    });

    describe('getUserByEmail', () => {
        it('should find user by email', async () => {
            const userData = {
                email: 'findme@example.com',
                name: 'Find Me',
                password: 'hashedpassword123',
            };

            await UserService.createUser(userData);
            const user = await UserService.getUserByEmail(userData.email);

            expect(user).toBeDefined();
            expect(user!.email).toBe(userData.email);
        });

        it('should return null for non-existent email', async () => {
            const user = await UserService.getUserByEmail(
                'nonexistent@example.com'
            );
            expect(user).toBeNull();
        });
    });

    describe('getUsers', () => {
        it('should return paginated users', async () => {
            const result = await UserService.getUsers({ page: 1, limit: 10 });

            expect(result.users).toBeArray();
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(result.total).toBeNumber();
            expect(result.totalPages).toBeNumber();
        });

        it('should filter users by search term', async () => {
            const result = await UserService.getUsers({ search: 'admin' });

            expect(result.users).toBeArray();
            // Should contain users with 'admin' in name or email
        });
    });
});
