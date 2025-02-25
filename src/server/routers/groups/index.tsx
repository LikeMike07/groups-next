import { getGroupDescendants } from '@/server/db/helperfns';
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
            .select()
            .from(users)
            .innerJoin(memberships, eq(users.id, memberships.user_id))
            .where(eq(memberships.group_id, groupId));

        return members;
    }),

    updateGroupName: authedProcedure.input(z.object({ name: z.string(), groupId: z.number() })).mutation(async (opts) => {
        const { db } = opts.ctx;
        const { name, groupId } = opts.input;
        const group = db.update(groups).set({ name: name }).where(eq(groups.id, groupId));
        return group;
    }),
});
