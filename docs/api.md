# API Documentation

## Overview

This is a modern REST API built with **Bun** and **Elysia** framework. The API provides authentication and user management functionality with a clean, scalable architecture.

## Features

- 🚀 **Fast Performance** - Built with Bun runtime
- 🔐 **JWT Authentication** - Secure token-based authentication
- 📝 **Auto-generated Documentation** - Swagger/OpenAPI integration
- ✅ **Type Safety** - Full TypeScript support
- 🧪 **Testing** - Comprehensive test suite
- 📦 **Modular Architecture** - Well-organized code structure

## Base URL

```
http://localhost:3000
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /api/v1/auth/register

Register a new user account.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "user": {
            "id": "1",
            "email": "user@example.com",
            "name": "John Doe"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Registration successful"
}
```

#### POST /api/v1/auth/login

Login with existing credentials.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "user": {
            "id": "1",
            "email": "user@example.com",
            "name": "John Doe"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Login successful"
}
```

### Users

#### GET /api/v1/users

Get a list of users (requires authentication).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10, max: 100)
- `search` (optional): Search term for name or email
- `sortBy` (optional): Field to sort by (default: name)
- `sortOrder` (optional): Sort order - 'asc' or 'desc' (default: asc)

**Response:**

```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": "1",
                "email": "user@example.com",
                "name": "John Doe",
                "createdAt": "2024-01-01T00:00:00.000Z",
                "updatedAt": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    },
    "message": "Users retrieved successfully"
}
```

#### GET /api/v1/users/:id

Get a specific user by ID (requires authentication).

#### PUT /api/v1/users/:id

Update a user (requires authentication).

#### DELETE /api/v1/users/:id

Delete a user (requires authentication).

## Error Responses

All error responses follow this format:

```json
{
    "success": false,
    "message": "Error message",
    "statusCode": 400
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Interactive Documentation

Visit `/docs` endpoint for interactive Swagger documentation.
