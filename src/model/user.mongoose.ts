import mongoose, { Schema, Document } from 'mongoose';

// Interface for the User document
export interface IUser {
    email: string;
    name: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Extend the User interface for Mongoose
export interface UserDocument extends IUser, Document {
    _id: mongoose.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema
const userSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v: string) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Please enter a valid email address',
            },
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't include password in queries by default
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        toJSON: {
            transform: function (doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            },
        },
        toObject: {
            transform: function (doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Index for better performance (email index is already created by unique: true)
userSchema.index({ createdAt: -1 });

// Virtual for id field
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await Bun.password.verify(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with Bun
        if (this.password) {
            this.password = await Bun.password.hash(this.password);
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Static method to find user by email (including password)
userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email }).select('+password');
};

// Export the model
export const UserModel = mongoose.model<UserDocument>('User', userSchema);
