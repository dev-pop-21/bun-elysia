import { t } from 'elysia';

// Login model
export const LoginModel = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 6 }),
});

// Register model
export const RegisterModel = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 6 }),
    name: t.String({ minLength: 2 }),
});

// Auth response model
export const AuthResponseModel = t.Object({
    user: t.Object({
        id: t.String(),
        email: t.String(),
        name: t.String(),
    }),
    token: t.String(),
});

// JWT payload model
export const JWTPayloadModel = t.Object({
    userId: t.String(),
    email: t.String(),
    iat: t.Optional(t.Number()),
    exp: t.Optional(t.Number()),
});
