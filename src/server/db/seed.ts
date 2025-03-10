import { sql, eq } from 'drizzle-orm';
import { db } from './index'; // Adjust import path
import * as schema from './schema'; // Adjust import path
import { createPathLabel, enableLtree } from './helperfns';
import { reset } from 'drizzle-seed';

interface GroupNode {
    name: string;
    children?: GroupNode[];
}

// Sample hierarchical data structure
const groupTree: GroupNode[] = [
    {
        name: 'Creovia',
        children: [
            {
                name: 'Front-End',
                children: [
                    { name: 'Web Dev', children: [{ name: 'React Team' }, { name: 'NextJs Team' }] },
                    { name: 'Mobile Dev', children: [{ name: 'Swift Team' }, { name: 'Flutter Team' }] },
                    { name: 'UI/UX Design' },
                ],
            },
            {
                name: 'Back-End',
                children: [{ name: 'API' }, { name: 'Systems' }],
            },
        ],
    },
    {
        name: 'Charter One',
        children: [
            {
                name: 'ALA',
                children: [{ name: 'Gilbert' }, { name: 'Chandler' }, { name: 'Mesa' }],
            },
        ],
    },
];

const users: Array<{ first_name: string; last_name: string; groups: Array<string>; email: string }> = [
    {
        first_name: 'Michael',
        last_name: 'Raisch',
        groups: ['Creovia', 'Front-End', 'Web Dev', 'React Team'],
        email: 'michael@creovia.io',
    },
    {
        first_name: 'Miles',
        last_name: 'Owens',
        groups: ['Creovia', 'Front-End', 'Web Dev', 'React Team'],
        email: 'miles@creovia.io',
    },
    {
        first_name: 'Justin',
        last_name: 'Ellis',
        groups: ['Creovia', 'Front-End', 'Mobile Dev', 'Flutter Team'],
        email: 'justin@creovia.io',
    },
    {
        first_name: 'Drew',
        last_name: 'Mudry',
        groups: ['Creovia', 'Back-End', 'API'],
        email: 'drew@creovia.io',
    },
    {
        first_name: 'Jason',
        last_name: 'Perez',
        groups: ['Creovia', 'Charter One'],
        email: 'jason@creovia.io',
    },
    {
        first_name: 'Morgan',
        last_name: 'Nuttall',
        groups: ['Creovia', 'Back-End', 'Systems'],
        email: 'morgan@creovia.io',
    },
    {
        first_name: 'Ian',
        last_name: 'Turner',
        groups: ['Creovia', 'Back-End', 'API'],
        email: 'ian@creovia.io',
    },
    {
        first_name: 'Elvia',
        last_name: 'Franco',
        groups: ['Creovia', 'Front-End', 'UI/UX Design'],
        email: 'elvia@creovia.io',
    },
    {
        first_name: 'John',
        last_name: 'Doe',
        groups: ['ALA', 'Chandler'],
        email: 'john@ala.com',
    },
    {
        first_name: 'Jane',
        last_name: 'Doe',
        groups: ['Gilbert'],
        email: 'jane@gilbert.com',
    },
];

// Recursive function to insert categories
async function insertGroups(node: GroupNode, parentPath: string | null = null): Promise<void> {
    const pathLabel = createPathLabel(node.name);
    const fullPath = parentPath ? `${parentPath}.${pathLabel}` : pathLabel;

    // Insert the current category
    await db.insert(schema.groups).values({
        name: node.name,
        path: fullPath,
    });

    // Recursively insert children
    if (node.children) {
        for (const child of node.children) {
            await insertGroups(child, fullPath);
        }
    }
}

// Main seed function
export async function seedGroups() {
    try {
        // First, ensure the ltree extension is enabled
        await db.execute(enableLtree);

        // Clear existing data
        await reset(db, schema);

        // Insert all categories
        for (const rootGroup of groupTree) {
            await insertGroups(rootGroup);
        }

        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    } finally {
        await verifySeed();
        try {
            await seedUsers();
            console.log('Users seeded successfully');
        } catch (error) {
            console.error('Error seeding users:', error);
            throw error;
        }
    }
}

export async function seedUsers() {
    await db.delete(schema.users);

    users.forEach(async (user) => {
        const insertedUserId = await db
            .insert(schema.users)
            .values({
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            })
            .returning({ id: schema.users.id });

        const targetGroups = await Promise.all(
            user.groups.map(async (groupName) => db.select({ id: schema.groups.id }).from(schema.groups).where(eq(schema.groups.name, groupName)))
        );

        await Promise.all(
            targetGroups.map(async (targetGroup) =>
                db.insert(schema.memberships).values({ userId: insertedUserId[0].id, groupId: targetGroup[0].id })
            )
        );
    });
}

// Function to verify the seeding
export async function verifySeed() {
    const allGroups = await db
        .select()
        .from(schema.groups)
        .orderBy(sql`path`);

    console.log('\nSeeded Categories:');
    allGroups.forEach((category) => {
        // Calculate indentation based on path depth
        const depth = category.path.split('.').length - 1;
        const indent = '    '.repeat(depth);
        console.log(`${indent}${category.name} (${category.path})`);
    });
}

seedGroups();
