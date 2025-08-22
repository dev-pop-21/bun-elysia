import { beforeAll, afterAll } from 'bun:test';
import { DatabaseService } from '../src/services/database.service';

beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/bun_elysia_test';

    // Initialize test database
    const db = DatabaseService.getInstance();
    await db.connect();

    // Clear all test data
    await db.clearCollections();

    console.log('🧪 Test setup completed');
});

afterAll(async () => {
    // Clear all test data
    const db = DatabaseService.getInstance();
    await db.clearCollections();

    // Cleanup test database
    await db.disconnect();

    console.log('🧪 Test cleanup completed');
});
