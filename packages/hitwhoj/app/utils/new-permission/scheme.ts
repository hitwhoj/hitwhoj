import { z } from "zod";

export const teamIdScheme = z.string().min(1);
export const teamRoleScheme = z.string().min(1);
