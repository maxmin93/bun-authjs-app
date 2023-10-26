import {
  bigint, // integer,
  uuid, // serial,
  pgTable,
  text,
  varchar,
  timestamp,
  unique,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

/*
// [Drizzle - Table schemas](https://orm.drizzle.team/docs/schemas)
// create schema if not exists twitter;
export const mySchema = pgSchema('twitter');
 */

////////////////////////////////////////////////////////
//
// https://authjs.dev/reference/adapter/drizzle#postgres
//

// PK: verification_token(identifier, token)
export const verificationTokens = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    compoundPk: primaryKey(t.identifier, t.token),
  })
);

// PK: user(id)
export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }),
  image: text('image'),
});

export type UserType = typeof users.$inferInsert;

// PK: account(id)
// UK: account(provider, providerAccountId)
// FK: account.userId = user.id
export const accounts = pgTable(
  'account',
  {
    id: uuid('id').notNull().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: bigint('expires_at', { mode: 'number' }),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => ({
    compoundUk: unique().on(t.provider, t.providerAccountId),
  })
);

// PK: session(id)
// UK: session(sessionToken)
// FK: session.userId = user.id
export const sessions = pgTable(
  'session',
  {
    id: uuid('id').notNull().primaryKey(),
    sessionToken: text('sessionToken').notNull(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    uk: unique().on(t.sessionToken),
  })
);

/*
// 필요 없음

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: one(sessions, {
    fields: [users.id],
    references: [sessions.userId],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
*/
