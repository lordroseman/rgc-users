export type AuthResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    refresh_token?: string;
    refresh_expires_in?: number;
}

export type RefreshResponse = {
    access_token: string;
    expires_in: number;
}

export type User = {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    roles: string[];
}