import {  z } from "zod/v4";


export const UnitTypeSchema = z.object({
    id: z.number().nullable(),
    name: z.string(),
    description: z.string().optional(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable(),
});

export type UnitType = z.infer<typeof UnitTypeSchema>;

export const UnitSchema = z.object({
    id: z.number().nullable(),
    unit_type_id: z.number(),
    name: z.string(),
    symbol: z.string(),
    conversion_rate: z.number().nullable(),
    is_base_unit: z.boolean().default(false),
});

export type Unit = z.infer<typeof UnitSchema>;