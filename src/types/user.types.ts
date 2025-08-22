export interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    email: string;
    name: string;
    password: string;
}

export interface UserUpdateInput {
    name?: string;
    email?: string;
}

export interface UserQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
