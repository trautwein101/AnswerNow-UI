
//match API DTOs
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    displayName: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    accessTokenExpiration: string;
    refreshToken: string;
    refreshTokenExpiration: string;

    userId: number;
    email: string;
    displayName: string;
    role: string; //admin, moderator, user
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// version of the enum as const object
export const UserRoles = {
    User: 'User',
    Moderator: 'Moderator',
    Admin: 'Admin'
} as const;

// creates a type from the values
export type UserRole = typeof UserRoles[keyof typeof UserRoles];

//tracking user in app ~ no API Dto
export interface User {
    userId: number;
    email: string;
    displayName: string;
    role: UserRole;
}
