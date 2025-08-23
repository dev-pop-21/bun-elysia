# Rate Limiting Configuration

This application implements multiple levels of rate limiting using the `elysia-rate-limit` package. All rate limits can be configured through environment variables.

## Environment Variables

### Global Settings
- `RATE_LIMIT_ENABLED` - Enable/disable rate limiting (default: `true`)

### General Rate Limit (Applied to all endpoints)
- `RATE_LIMIT_GENERAL_DURATION` - Time window in milliseconds (default: `60000` = 1 minute)
- `RATE_LIMIT_GENERAL_MAX_PROD` - Max requests in production (default: `100`)
- `RATE_LIMIT_GENERAL_MAX_DEV` - Max requests in development (default: `1000`)

### API Rate Limit (Applied to /api/v1/* endpoints)
- `RATE_LIMIT_API_DURATION` - Time window in milliseconds (default: `60000` = 1 minute)
- `RATE_LIMIT_API_MAX_PROD` - Max requests in production (default: `200`)
- `RATE_LIMIT_API_MAX_DEV` - Max requests in development (default: `500`)

### Auth Rate Limit (Applied to /api/v1/auth/* endpoints)
- `RATE_LIMIT_AUTH_DURATION` - Time window in milliseconds (default: `60000` = 1 minute)
- `RATE_LIMIT_AUTH_MAX_PROD` - Max requests in production (default: `5`)
- `RATE_LIMIT_AUTH_MAX_DEV` - Max requests in development (default: `20`)

### Sensitive Operations Rate Limit
- `RATE_LIMIT_SENSITIVE_DURATION` - Time window in milliseconds (default: `300000` = 5 minutes)
- `RATE_LIMIT_SENSITIVE_MAX_PROD` - Max requests in production (default: `3`)
- `RATE_LIMIT_SENSITIVE_MAX_DEV` - Max requests in development (default: `10`)

## Rate Limit Levels

### 1. General Rate Limit
- **Applied to**: All endpoints globally
- **Production**: 100 requests per minute (configurable via `RATE_LIMIT_GENERAL_MAX_PROD`)
- **Development**: 1000 requests per minute (configurable via `RATE_LIMIT_GENERAL_MAX_DEV`)
- **Window**: 1 minute (configurable via `RATE_LIMIT_GENERAL_DURATION`)

### 2. API Rate Limit
- **Applied to**: All `/api/v1/*` endpoints
- **Production**: 200 requests per minute (configurable via `RATE_LIMIT_API_MAX_PROD`)
- **Development**: 500 requests per minute (configurable via `RATE_LIMIT_API_MAX_DEV`)
- **Window**: 1 minute (configurable via `RATE_LIMIT_API_DURATION`)

### 3. Authentication Rate Limit
- **Applied to**: All `/api/v1/auth/*` endpoints
- **Production**: 5 requests per minute (configurable via `RATE_LIMIT_AUTH_MAX_PROD`)
- **Development**: 20 requests per minute (configurable via `RATE_LIMIT_AUTH_MAX_DEV`)
- **Window**: 1 minute (configurable via `RATE_LIMIT_AUTH_DURATION`)

### 4. Sensitive Operations Rate Limit
- **Applied to**: Can be used for password reset, account deletion, etc.
- **Production**: 3 requests per 5 minutes (configurable via `RATE_LIMIT_SENSITIVE_MAX_PROD`)
- **Development**: 10 requests per 5 minutes (configurable via `RATE_LIMIT_SENSITIVE_MAX_DEV`)
- **Window**: 5 minutes (configurable via `RATE_LIMIT_SENSITIVE_DURATION`)

## Headers

When rate limiting is active, the following headers are included in responses:

- `RateLimit-Limit`: The maximum number of requests allowed in the time window
- `RateLimit-Remaining`: The number of requests remaining in the current window
- `RateLimit-Reset`: The time remaining until the rate limit resets (in seconds)

## Error Response

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "statusCode": 429
}
```

## Usage Example

To apply sensitive rate limiting to a specific route:

```typescript
import { sensitiveRateLimit } from '../plugins';

const myRoutes = new Elysia()
  .use(sensitiveRateLimit)
  .post('/reset-password', handler);
```

## Configuration Example

Add these environment variables to your `.env` file:

```bash
# Enable rate limiting
RATE_LIMIT_ENABLED=true

# Custom general rate limit (500 requests per 2 minutes in production)
RATE_LIMIT_GENERAL_DURATION=120000
RATE_LIMIT_GENERAL_MAX_PROD=500

# Custom auth rate limit (10 requests per minute in production)
RATE_LIMIT_AUTH_MAX_PROD=10
```

## Disabling Rate Limiting

To completely disable rate limiting, set:

```bash
RATE_LIMIT_ENABLED=false
```

## Configuration

Rate limits can be adjusted in `src/plugins/rate-limit.plugin.ts` or through environment variables in `.env` file. Environment variables take precedence over default values.
