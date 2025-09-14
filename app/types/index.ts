import {  z } from "zod";


export const RoleSchema = z.object({
    id: z.union([z.string(), z.number()]).nullable().optional(),
    name: z.string().min(1, "Role name is required"),
    permissions: z.array(z.string()).optional(),

});

export type Role = z.infer<typeof RoleSchema>;


export const PermissionSchema = z.object({
    id: z.union([z.string(), z.number()]).nullable().optional(),
    name: z.string().min(1, "Permission name is required"),
});

export type Permission = z.infer<typeof PermissionSchema>;
