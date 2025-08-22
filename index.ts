import { app } from './src/app';
import { appConfig } from './src/config';

const PORT = appConfig.port;

app.listen(PORT, () => {
    console.log(`🦊 ${appConfig.appName} is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${appConfig.nodeEnv}`);
});

export { app };
