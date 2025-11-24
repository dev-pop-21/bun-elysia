import { DATABASE_CONFIG } from '@util/constants';

export const databaseConfig = {
    url: DATABASE_CONFIG.URL,
    maxConnections: DATABASE_CONFIG.MAX_POOL_SIZE,
    connectionTimeout: DATABASE_CONFIG.SERVER_SELECTION_TIMEOUT_MS,

    // MongoDB/Mongoose options
    options: {
        // Connection options
        dbName: DATABASE_CONFIG.DATABASE_NAME, // Database name
        maxPoolSize: DATABASE_CONFIG.MAX_POOL_SIZE, // Maximum number of connections
        serverSelectionTimeoutMS: DATABASE_CONFIG.SERVER_SELECTION_TIMEOUT_MS, // How long to try selecting a server
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity

        // Authentication (if needed)
        // authSource: 'admin',
        // authMechanism: 'SCRAM-SHA-1',

        // SSL/TLS (for production)
        // ssl: process.env.NODE_ENV === 'production',
        // sslValidate: process.env.NODE_ENV === 'production',

        // Application name for MongoDB logs
        appName: 'BunElysiaAPI',

        // Read/Write Concern
        w: 'majority',
        readPreference: 'primary',

        // Topology options
        family: 4, // Use IPv4, skip trying IPv6
    },

    // Development vs Production settings
    development: {
        debug: true,
        autoIndex: true, // Build indexes in development
    },

    production: {
        debug: false,
        autoIndex: false, // Don't build indexes in production
    },
};
