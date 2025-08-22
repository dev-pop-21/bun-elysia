import { Elysia } from 'elysia';
import { AuthService } from '../services/auth.service';

export const authMiddleware = new Elysia().derive(({ headers, set }) => {
    const authorization = headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        set.status = 401;
        throw new Error('Authorization header missing or invalid');
    }

    const token = authorization.slice(7); // Remove 'Bearer ' prefix

    try {
        const payload = AuthService.verifyToken(token);
        return {
            user: payload,
        };
    } catch (error) {
        set.status = 401;
        throw new Error('Invalid or expired token');
    }
});
