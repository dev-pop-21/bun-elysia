import { t } from 'elysia';

export const ValidationSchemas = {
    // Auth validation schemas
    login: t.Object({
        email: t.String({
            format: 'email',
            error: 'Please provide a valid email address',
        }),
        password: t.String({
            minLength: 6,
            error: 'Password must be at least 6 characters long',
        }),
    }),

    register: t.Object({
        email: t.String({
            format: 'email',
            error: 'Please provide a valid email address',
        }),
        password: t.String({
            minLength: 6,
            error: 'Password must be at least 6 characters long',
        }),
        name: t.String({
            minLength: 2,
            error: 'Name must be at least 2 characters long',
        }),
    }),

    // User validation schemas
    updateUser: t.Object({
        name: t.Optional(
            t.String({
                minLength: 2,
                error: 'Name must be at least 2 characters long',
            })
        ),
        email: t.Optional(
            t.String({
                format: 'email',
                error: 'Please provide a valid email address',
            })
        ),
    }),

    // Common validation schemas
    id: t.Object({
        id: t.String({
            error: 'ID is required',
        }),
    }),

    pagination: t.Object({
        page: t.Optional(t.Number({ minimum: 1 })),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
        search: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
    }),
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
};
