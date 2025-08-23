import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import type { User } from '../types/user.types';
import { UserService } from './user.service';
import { UserModel, type UserDocument } from '../models/user.mongoose';
import { sign, verify } from 'jsonwebtoken';

export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

    static async login(loginData: LoginRequest): Promise<AuthResponse> {
        const { email, password } = loginData;

        try {
            // Find user by email (including password)
            const user = await UserModel.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password using the model's comparePassword method
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = this.generateToken({
                userId: user._id.toString(),
                email: user.email,
            });

            return {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                },
                token,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Login failed');
        }
    }

    static async register(registerData: RegisterRequest): Promise<AuthResponse> {
        const { email, password, name } = registerData;

        try {
            // Create user using UserService (which now uses MongoDB)
            const newUser = await UserService.createUser({
                email,
                name,
                password,
            });

            // Generate JWT token
            const token = this.generateToken({
                userId: newUser.id,
                email: newUser.email,
            });

            return {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                },
                token,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Registration failed');
        }
    }

    static generateToken(payload: { userId: string; email: string }): string {
        return sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        } as any);
    }

    static verifyToken(token: string): { userId: string; email: string } {
        try {
            const decoded = verify(token, this.JWT_SECRET) as any;
            return {
                userId: decoded.userId,
                email: decoded.email,
            };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
