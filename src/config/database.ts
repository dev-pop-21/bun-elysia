import { DATABASE_CONFIG } from '../utils/constants';

export const databaseConfig = {
    url: DATABASE_CONFIG.URL,
    maxConnections: DATABASE_CONFIG.MAX_CONNECTIONS,
    connectionTimeout: DATABASE_CONFIG.CONNECTION_TIMEOUT,

    // MongoDB/Mongoose options
    options: {
        // Connection options
        maxPoolSize: DATABASE_CONFIG.MAX_CONNECTIONS, // Maximum number of connections
        serverSelectionTimeoutMS: DATABASE_CONFIG.CONNECTION_TIMEOUT, // How long to try selecting a server
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
