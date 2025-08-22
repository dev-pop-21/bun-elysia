# Bun Elysia API

A modern, high-performance REST API built with **Bun** and **Elysia** framework. This project demonstrates best practices for building scalable Node.js alternatives with TypeScript.

## 🚀 Features

- **⚡ Lightning Fast**: Built with Bun runtime for exceptional performance
- **🔐 JWT Authentication**: Secure token-based authentication system
- **📝 Auto Documentation**: Swagger/OpenAPI integration with interactive docs
- **✨ Type Safety**: Full TypeScript support with strict type checking
- **🧪 Testing**: Comprehensive test suite with Bun's built-in test runner
- **📦 Modular Architecture**: Clean, organized, and scalable code structure
- **🔄 Hot Reload**: Fast development with automatic reloading
- **🚦 Middleware Support**: CORS, logging, authentication, and more

## 📋 Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)
- Node.js (v18.0.0 or higher) - as fallback

## 🛠️ Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd bun-elysia
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` file with your configuration:

    ```env
    PORT=3000
    NODE_ENV=development
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRES_IN=7d
    MONGODB_URI=mongodb://localhost:27017/bun_elysia
    ```

4. **Start the development server**
    ```bash
    bun run dev
    ```

## 📂 Project Structure

```
bun-elysia/
├── src/
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Custom middlewares
│   ├── routes/              # API routes
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── config/              # Configuration files
│   ├── plugins/             # Elysia plugins
│   └── app.ts               # Main application
├── tests/                   # Test files
├── docs/                    # Documentation
├── public/                  # Static files
├── scripts/                 # Build scripts
└── index.ts                 # Application entry point
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run start        # Start production server
bun run build        # Build for production

# Testing
bun test             # Run all tests
bun test:watch       # Run tests in watch mode
bun test:coverage    # Run tests with coverage

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run type-check   # TypeScript type checking
```

## 📖 API Documentation

Once the server is running, you can access:

- **API Base URL**: `http://localhost:3000/api/v1`
- **Interactive Docs**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

For detailed API documentation, see [API Documentation](./docs/api.md).

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test tests/controllers/auth.controller.test.ts
```

## 🚀 Deployment

### Using Docker

```bash
# Build image
docker build -t bun-elysia .

# Run container
docker run -p 3000:3000 bun-elysia
```

### Using PM2

```bash
# Install PM2
bun add -g pm2

# Start application
pm2 start ecosystem.config.js
```

## 🔐 Environment Variables

| Variable         | Description    | Default                                |
| ---------------- | -------------- | -------------------------------------- |
| `PORT`           | Server port    | `3000`                                 |
| `NODE_ENV`       | Environment    | `development`                          |
| `JWT_SECRET`     | JWT secret key | Required                               |
| `JWT_EXPIRES_IN` | JWT expiration | `7d`                                   |
| `MONGODB_URI`    | MongoDB URL    | `mongodb://localhost:27017/bun_elysia` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bun](https://bun.sh) - The fast JavaScript runtime
- [Elysia](https://elysiajs.com) - The ergonomic web framework
- [TypeScript](https://www.typescriptlang.org) - For type safety
