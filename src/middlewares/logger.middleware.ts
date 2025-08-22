import { Elysia } from 'elysia';

export const loggerMiddleware = new Elysia()
    .onRequest(({ request }) => {
        const timestamp = new Date().toISOString();
        const method = request.method;
        const url = new URL(request.url).pathname;

        console.log(`[${timestamp}] ${method} ${url}`);
    })
    .onAfterHandle(({ request, set }) => {
        const timestamp = new Date().toISOString();
        const method = request.method;
        const url = new URL(request.url).pathname;
        const status = set.status || 200;

        console.log(`[${timestamp}] ${method} ${url} - ${status}`);
    })
    .onError(({ error, request, set }) => {
        const timestamp = new Date().toISOString();
        const method = request.method;
        const url = new URL(request.url).pathname;
        const status = set.status || 500;

        console.error(
            `[${timestamp}] ${method} ${url} - ${status} - Error: ${error instanceof Error ? error.message : String(error)}`
        );
    });
