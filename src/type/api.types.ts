export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message: string;
    error?: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode?: number;
}

export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message: string;
}
