import { db } from '$lib/server/drizzle';
import { error } from '@sveltejs/kit';
import { users } from '$lib/schema/auth';
import { posts } from '$lib/schema/post';
import { eq, desc } from 'drizzle-orm';

export async function load({ params }) {
  const id = params.id;

  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .leftJoin(users, eq(users.id, posts.userId));

  if (!result.length) {
    return error(404, 'Post or User not found');
  }

  const { user, post } = result.shift() ?? { user: undefined, post: undefined };
  return { user, post };
}
