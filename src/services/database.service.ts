import mongoose from 'mongoose';
import { databaseConfig } from '../config/database';

export class DatabaseService {
    private static instance: DatabaseService;
    private isConnected: boolean = false;

    private constructor() {}

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async connect(): Promise<void> {
        try {
            if (this.isConnected) {
                console.log('📦 Database already connected');
                return;
            }

            console.log('🗄️ Connecting to MongoDB...');

            // Configure mongoose settings
            mongoose.set('strictQuery', false);

            // Connect to MongoDB
            await mongoose.connect(databaseConfig.url, databaseConfig.options as any);

            this.isConnected = true;
            console.log('✅ MongoDB connected successfully');

            // Handle connection events
            mongoose.connection.on('error', error => {
                const message = error instanceof Error ? error.message : 'Unknown error';
                console.error('❌ MongoDB connection error:', message);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('📡 MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
                this.isConnected = true;
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ MongoDB connection failed:', message);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (!this.isConnected) {
                console.log('📦 Database already disconnected');
                return;
            }

            console.log('🗄️ Disconnecting from MongoDB...');
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('✅ MongoDB disconnected successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ MongoDB disconnection failed:', message);
            throw error;
        }
    }

    isHealthy(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    getConnection() {
        return mongoose.connection;
    }

    // Database utility methods
    async dropDatabase(): Promise<void> {
        if (process.env.NODE_ENV === 'test') {
            await mongoose.connection.dropDatabase();
        }
    }

    async clearCollections(): Promise<void> {
        if (process.env.NODE_ENV === 'test') {
            const collections = mongoose.connection.collections;
            for (const key in collections) {
                await collections[key].deleteMany({});
            }
        }
    }
}
