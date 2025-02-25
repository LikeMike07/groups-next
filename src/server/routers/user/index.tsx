import { db } from '@/server/db';
import { enableLtree } from '@/server/db/helperfns';
import { groups, memberships } from '@/server/db/schema';
import { authedProcedure, router } from '@/server/trpc';
import { eq, sql, or } from 'drizzle-orm';

export const userRouter = router({
    groups: authedProcedure.query(async (opts) => {
        const userId = opts.ctx.user.id;
        await db.execute(enableLtree);

        // First get the paths of the user's direct groups
        const userGroupPaths = await db
            .select({ path: groups.path })
            .from(groups)
            .innerJoin(memberships, eq(memberships.group_id, groups.id))
            .where(eq(memberships.user_id, userId));

        if (userGroupPaths.length === 0) {
            return [];
        }

        // Create a union of all paths to search
        const pathsToSearch = userGroupPaths.map((g) => g.path).join(',');

        const query = db
            .select({
                id: groups.id,
                name: groups.name,
                path: groups.path,
                imgUrl: groups.imgUrl,
                relationship: sql<string>`
        CASE 
          WHEN ${groups.id} IN (
            SELECT group_id 
            FROM ${memberships} 
            WHERE user_id = ${userId}
          ) THEN 'direct'
          WHEN ${sql.raw(groups.path.name)}::ltree <@ ANY (string_to_array(${pathsToSearch}, ',')::ltree[]) THEN 'descendant'
          WHEN ${sql.raw(groups.path.name)}::ltree @> ANY (string_to_array(${pathsToSearch}, ',')::ltree[]) THEN 'ancestor'
        END
      `.as('relationship'),
            })
            .from(groups)
            .where(
                or(
                    // Direct memberships
                    sql`${groups.id} IN (
          SELECT group_id 
          FROM ${memberships} 
          WHERE user_id = ${userId}
        )`,
                    // Descendants (using your helper function logic)
                    sql`${sql.raw(groups.path.name)}::ltree <@ ANY (string_to_array(${pathsToSearch}, ',')::ltree[])`,
                    // Ancestors (using your helper function logic)
                    sql`${sql.raw(groups.path.name)}::ltree @> ANY (string_to_array(${pathsToSearch}, ',')::ltree[])`
                )
            );
        return query;
    }),
});
