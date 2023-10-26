import { pgTableCreator } from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const twTable = pgTableCreator((name) => `twitter_${name}`);

// 참고
// - [테이블 prefix](https://github.com/edution-org/next-web/blob/main/packages/db/schema/_table.ts)
//   + export const pgTable = pgTableCreator((name) => `t3turbo_${name}`)
