import type {
    User,
    UserCreateInput,
    UserUpdateInput,
    UserQuery,
    PaginatedUsers,
} from '../types/user.types';
import { UserModel, type UserDocument } from '../models/user.mongoose';
import mongoose from 'mongoose';

export class UserService {
    static async getUsers(query: UserQuery = {}): Promise<PaginatedUsers> {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'name',
            sortOrder = 'asc',
        } = query;

        // Build search filter
        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        try {
            // Execute queries in parallel
            const [users, total] = await Promise.all([
                UserModel.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                UserModel.countDocuments(filter),
            ]);

            const totalPages = Math.ceil(total / limit);

            // Transform users to match User interface
            const transformedUsers: User[] = users.map(user => ({
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));

            return {
                users: transformedUsers,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }

    static async getUserById(id: string): Promise<User | null> {
        try {
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            const user = await UserModel.findById(id).lean();

            if (!user) return null;

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new Error('Failed to fetch user');
        }
    }

    static async getUserByEmail(email: string): Promise<UserDocument | null> {
        try {
            return await UserModel.findOne({ email }).select('+password');
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw new Error('Failed to fetch user');
        }
    }

    static async createUser(userData: UserCreateInput): Promise<User> {
        try {
            // Check if user already exists
            const existingUser = await UserModel.findOne({
                email: userData.email,
            });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = new UserModel(userData);
            await newUser.save();

            return {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    static async updateUser(
        id: string,
        updateData: UserUpdateInput
    ): Promise<User> {
        try {
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid user ID');
            }

            // Check if email is being updated and already exists
            if (updateData.email) {
                const existingUser = await UserModel.findOne({
                    email: updateData.email,
                    _id: { $ne: id },
                });
                if (existingUser) {
                    throw new Error('Email already exists');
                }
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                    lean: true,
                }
            );

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                name: updatedUser.name,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    static async deleteUser(id: string): Promise<void> {
        try {
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid user ID');
            }

            const deletedUser = await UserModel.findByIdAndDelete(id);

            if (!deletedUser) {
                throw new Error('User not found');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }

    // Additional utility methods for MongoDB
    static async getUserCount(): Promise<number> {
        try {
            return await UserModel.countDocuments();
        } catch (error) {
            console.error('Error counting users:', error);
            throw new Error('Failed to count users');
        }
    }

    static async searchUsers(searchTerm: string, limit = 10): Promise<User[]> {
        try {
            const users = await UserModel.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                ],
            })
                .limit(limit)
                .lean();

            return users.map(user => ({
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));
        } catch (error) {
            console.error('Error searching users:', error);
            throw new Error('Failed to search users');
        }
    }
}
