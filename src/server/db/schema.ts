import { integer, json, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

type Ltree = string;

export const groups = pgTable('groups', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    path: text('path').$type<Ltree>().notNull(),
    imgUrl: text('img_url'),
});

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar(),
    last_name: varchar(),
    email: text('email').unique(),
    password: varchar('password', { length: 160 }),
});

export const memberships = pgTable(
    'memberships',
    {
        user_id: integer('user_id')
            .notNull()
            .references(() => users.id),
        group_id: integer('group_id')
            .notNull()
            .references(() => groups.id),
    },
    (t) => [primaryKey({ columns: [t.user_id, t.group_id] })]
);

export const passwordSetupTokens = pgTable('password_setup_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').unique().notNull(),
    user_id: integer()
        .references(() => users.id)
        .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    sessionData: json('session_data'),
    createdAt: timestamp('created_at').defaultNow(),
    expiresAt: timestamp('expires_at').notNull(),
});
