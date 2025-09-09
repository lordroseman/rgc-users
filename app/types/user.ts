import { z } from "zod";

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

export const UserSchema = z.object({
    id: z.number().nullable().optional(),
    id_num: z.string().min(1, "Please input Employee ID"),
    name: z.string().min(1, "Please input first name"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email().or(z.literal('')).optional(),
    permissions: z.array(z.string()).optional(),
    roles: z.array(z.string()).min(1, "At least one role is required"),
    // allow password to be optional / null for updates
    password: z.string().nullable().optional(),
}) 

export type User = z.infer<typeof UserSchema>;

