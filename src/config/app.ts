import { APP_CONFIG } from '@util/constants';
import { name, description, version } from '@app/package.json';

export const appConfig = {
    port: APP_CONFIG.PORT,
    nodeEnv: APP_CONFIG.NODE_ENV,
    apiVersion: APP_CONFIG.API_VERSION,
    apiPrefix: APP_CONFIG.API_PREFIX,

    // App-specific configurations
    appName: name,
    appVersion: version,
    appDescription: description,

    // Feature flags
    features: {
        swagger: true,
        cors: true,
        rateLimit: true,
        logging: true,
    },

    // Security configurations
    security: {
        bcryptRounds: 12,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    },

    isDevelopment: () => APP_CONFIG.NODE_ENV === 'development',
    isProduction: () => APP_CONFIG.NODE_ENV === 'production',
    isTest: () => APP_CONFIG.NODE_ENV === 'test',
};
