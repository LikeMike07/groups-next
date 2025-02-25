import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const createPathLabel = (str: string) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');
};

export const enableLtree = sql`CREATE EXTENSION IF NOT EXISTS ltree`;

export async function getGroupChildren(db: NodePgDatabase<typeof schema>, groupPath: string) {
    await db.execute(enableLtree);
    return db.execute(sql`
      SELECT * FROM "groups" 
      WHERE "path"::ltree ~ (${groupPath}::ltree || '.*{1}')
    `);
}

export async function getGroupDescendants(db: NodePgDatabase<typeof schema>, groupPath: string) {
    await db.execute(enableLtree);
    const result = await db.execute(sql`
      SELECT * FROM "groups" 
      WHERE "path"::ltree <@ ${groupPath}::ltree
    `);
    return result.rows.map((row) => ({
        id: row.id as number,
        name: row.name as string,
        path: row.path as string,
        imgUrl: row.img_url as string | null,
    }));
}

export async function getGroupAncestors(db: NodePgDatabase<typeof schema>, groupPath: string) {
    await db.execute(enableLtree);
    return db.execute(sql`
      SELECT * FROM "groups" 
      WHERE "path"::ltree @> ${groupPath}::ltree
    `);
}
