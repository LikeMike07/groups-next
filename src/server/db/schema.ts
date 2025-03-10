import { boolean, integer, json, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

type Ltree = string;

export const groups = pgTable('groups', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    path: text('path').$type<Ltree>().notNull(),
    imgUrl: text('img_url'),
    bannerImgUrl: text('banner_img_url'),
    description: text('description').default('').notNull(),
    location: varchar(''),
});

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name').notNull(),
    email: text('email').unique(),
    externalId: varchar().unique(),
    password: varchar('password', { length: 160 }),
    imgUrl: text('img_url'),
});

export const roles = pgTable('roles', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    groupId: integer('group_id').references(() => groups.id),
    name: varchar().notNull(),
    description: text().default('').notNull(),
    isAdmin: boolean('is_admin').default(false).notNull(),
    /* Group management roles */
    canUseGroups: boolean('can_use_groups').default(false).notNull(),
    canEditGroup: boolean('can_edit_group').default(false).notNull(),
    canAddMembers: boolean('can_add_members').default(false).notNull(),
    canViewGroup: boolean('can_view_group').default(false).notNull(),
    canManageRoles: boolean('can_manage_roles').default(false).notNull(),
    /* Directory roles */
    canUseDirectory: boolean('can_use_directory').default(true).notNull(),
    canViewDirectory: boolean('can_view_directory').default(true).notNull(),
    canViewInheritedMembers: boolean('can_view_inherited_members').default(true).notNull(),
    canViewSensitiveData: boolean('can_view_sesitive_data').default(false).notNull(),
});

export const memberships = pgTable(
    'memberships',
    {
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        groupId: integer('group_id')
            .notNull()
            .references(() => groups.id),
        roleId: integer()
            .notNull()
            .references(() => roles.id)
            .default(1),
    },
    (t) => [primaryKey({ columns: [t.userId, t.groupId] })]
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
