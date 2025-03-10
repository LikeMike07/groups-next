import { z } from 'zod';

export const roleSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    isAdmin: z.boolean().default(false),
    /* Group Management perms */
    canUseGroups: z.boolean().default(false),
    canEditGroup: z.boolean().default(false),
    canAddMembers: z.boolean().default(false),
    canViewGroup: z.boolean().default(false),
    canManageRoles: z.boolean().default(false),
    /* Directory perms */
    canUseDirectory: z.boolean().default(true),
    canViewDirectory: z.boolean().default(true),
    canViewInheritedMembers: z.boolean().default(true),
    canViewSensitiveData: z.boolean().default(false),
});
