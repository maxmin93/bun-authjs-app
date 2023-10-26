import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  serial,
  uuid,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

// public 스키마는 pgTable 을 써야 함
import { twTable } from './_table';
import { users } from './auth';

// PK: country(id)
export const countries = pgTable('country', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});

// PK: twitter_post(id)
export const posts = twTable('post', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4`),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
  userId: uuid('userId'), // .references(() => users.id),
  claps: integer('claps').default(0),
  tags: varchar('tags', { length: 50 }).array().default([]),
});

export type PostType = typeof posts.$inferInsert;

export const postRelations = relations(posts, ({ one }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

/*
CREATE TABLE twitter_country
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) not null,
  description TEXT,
  created_at TIMESTAMPTZ default current_timestamp(0),

  CONSTRAINT description_chk CHECK (char_length(description) < 512)
);

CREATE TABLE twitter_post
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content text COLLATE "ko-x-icu" NOT NULL,
  created_at TIMESTAMPTZ default (timezone('Asia/Seoul', current_timestamp)),
  "userId" uuid NOT NULL,
  claps integer default 0,
  tags varchar(50)[] default '{}',

  CONSTRAINT "twitter_post_userId_user_id_fk"
    FOREIGN KEY ("userId") REFERENCES "user"(id)
);

do $$
declare
  userId uuid := uuid_generate_v4();
begin
  -- print userId
  RAISE NOTICE 'userId here is %', userId;

  select '2301d2fd-d29d-4940-9409-43fb6a35c9a0' into userId;
insert into twitter_post (content, "userId", tags) values(
  '''스택오버플로어3
제목: Invalid default timestamp with timezone value for a column in Postgres
참고문서: https://stackoverflow.com/questions/52538404/invalid-default-timestamp-with-timezone-value-for-a-column-in-postgres
''', userId, '{}'
  );
end $$;
*/

// 참고: schema
// - [todo.ts](https://github.com/syhner/elysia-kickstart/blob/main/src/db/schemas/todo.ts)
// - [post.ts](https://github.com/edution-org/next-web/blob/main/packages/db/schema/post.ts)
