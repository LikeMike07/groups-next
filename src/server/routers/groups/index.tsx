import { createPathLabel, getGroupDescendants } from '@/server/db/helperfns';
import { groups, memberships, users } from '@/server/db/schema';
import { authedProcedure, router } from '@/server/trpc';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const groupRouter = router({
    getGroup: authedProcedure.input(z.object({ groupId: z.number() })).query(async (opts) => {
        const { db } = opts.ctx;
        const { groupId } = opts.input;

        const group = await db.query.groups.findFirst({ where: (groups, { eq }) => eq(groups.id, groupId) });

        if (!group) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'No group found',
            });
        }
        const children = await getGroupDescendants(db, group.path);
        return {
            ...group,
            children,
        };
    }),

    getMembersOfGroup: authedProcedure.input(z.object({ groupId: z.number() })).query(async (opts) => {
        const { db } = opts.ctx;
        const { groupId } = opts.input;

        const members = await db
            .select({
                id: users.id,
                first_name: users.firstName,
                last_name: users.lastName,
                email: users.email,
                imgUrl: users.imgUrl,
            })
            .from(users)
            .innerJoin(memberships, eq(users.id, memberships.userId))
            .where(eq(memberships.groupId, groupId));

        if (!members) throw new TRPCError({ code: 'BAD_REQUEST', message: 'failed to get group' });

        return members;
    }),

    updateGroupName: authedProcedure.input(z.object({ name: z.string(), groupId: z.number() })).mutation(async (opts) => {
        const { db } = opts.ctx;
        const { name, groupId } = opts.input;
        const group = db.update(groups).set({ name: name }).where(eq(groups.id, groupId));
        return group;
    }),

    addGroup: authedProcedure.input(z.object({ name: z.string(), parentId: z.number().optional() })).mutation(async (opts) => {
        const { db } = opts.ctx;
        const { name, parentId } = opts.input;

        if (!parentId) {
            const newGroup = await db
                .insert(groups)
                .values({ name: name, path: createPathLabel(name) })
                .returning();
            return newGroup[0];
        } else {
            const parentGroup = await db.query.groups.findFirst({ where: (groups, { eq }) => eq(groups.id, parentId) });

            if (!parentGroup) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No group found as Parent group',
                });
            }

            const newGroup = await db
                .insert(groups)
                .values({ name: name, path: createPathLabel(`${parentGroup.path}.${name}`) })
                .returning();

            return newGroup[0];
        }
    }),

    addUserToGroup: authedProcedure
        .input(
            z.object({
                user: z.object({
                    firstName: z.string(),
                    lastName: z.string(),
                    email: z.string(),
                    imgUrl: z.string().optional(),
                }),
                groupId: z.number(),
            })
        )
        .mutation(async (opts) => {
            const { db } = opts.ctx;
            const { user, groupId } = opts.input;

            const existingUser = await db.select().from(users).where(eq(users.email, user.email));

            if (existingUser.length > 0) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already exists with that email.' });

            const newUser = await db.insert(users).values(user).returning();

            const newMembership = await db.insert(memberships).values({ userId: newUser[0].id, groupId: groupId }).returning();

            if (newMembership.length < 1) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

            return newUser;
        }),

    getRoles: authedProcedure
        .input(
            z.object({
                groupId: z.number(),
            })
        )
        .query(async (opts) => {
            const { db } = opts.ctx;
            const { groupId } = opts.input;

            const roles = await db.query.roles.findMany({
                where: (roles, { eq, or, isNull }) => or(eq(roles.groupId, groupId), isNull(roles.groupId)),
            });

            return roles;
        }),

    editGroupDetails: authedProcedure
        .input(
            z.object({
                groupId: z.number(),
                details: z.object({
                    name: z.string(),
                    description: z.string(),
                    imgUrl: z.string().nullable(),
                    bannerImgUrl: z.string().nullable(),
                    location: z.string().optional(),
                }),
            })
        )
        .mutation(async (opts) => {
            const { db } = opts.ctx;
            const { groupId, details } = opts.input;

            return await db
                .update(groups)
                .set({ ...details })
                .where(eq(groups.id, groupId))
                .returning({
                    id: groups.id,
                    name: groups.name,
                    imgUrl: groups.imgUrl,
                    bannerImgUrl: groups.bannerImgUrl,
                    description: groups.description,
                    location: groups.location,
                });
        }),
});
