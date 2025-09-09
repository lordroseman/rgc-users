import {  z } from "zod/v4";


export const RoleSchema = z.object({
    id: z.union([z.string(), z.number()]).nullable().optional(),
    name: z.string(),
});

export type Role = z.infer<typeof RoleSchema>;
