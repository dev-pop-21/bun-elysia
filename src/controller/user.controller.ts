import { Elysia, t } from 'elysia';
import { UserService } from '@service/user.service';
import { authMiddleware } from '@middleware/auth.middleware';

export const userController = new Elysia()
    .use(authMiddleware)

    .get('/', async ({ query }) => {
        try {
            const users = await UserService.getUsers(query);
            return {
                success: true,
                data: users,
                message: 'Users retrieved successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to retrieve users',
            };
        }
    })

    .get(
        '/:id',
        async ({ params, set }) => {
            try {
                const user = await UserService.getUserById(params.id);
                if (!user) {
                    set.status = 404;
                    return {
                        success: false,
                        message: 'User not found',
                    };
                }
                return {
                    success: true,
                    data: user,
                    message: 'User retrieved successfully',
                };
            } catch (error) {
                set.status = 500;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to retrieve user',
                };
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),
        }
    )

    .put(
        '/:id',
        async ({ params, body, set }) => {
            try {
                const updatedUser = await UserService.updateUser(params.id, body);
                return {
                    success: true,
                    data: updatedUser,
                    message: 'User updated successfully',
                };
            } catch (error) {
                set.status = 400;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to update user',
                };
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            body: t.Object({
                name: t.Optional(t.String({ minLength: 2 })),
                email: t.Optional(t.String({ format: 'email' })),
            }),
        }
    )

    .delete(
        '/:id',
        async ({ params, set }) => {
            try {
                await UserService.deleteUser(params.id);
                return {
                    success: true,
                    message: 'User deleted successfully',
                };
            } catch (error) {
                set.status = 400;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to delete user',
                };
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),
        }
    );
