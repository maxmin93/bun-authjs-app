import { db } from '$lib/server/drizzle';
import { error } from '@sveltejs/kit';
import { users } from '$lib/schema/auth';
import { posts } from '$lib/schema/post';
import { eq, desc } from 'drizzle-orm';

export async function load({ params }) {
  const id = params.id;

  const results = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .innerJoin(posts, eq(users.id, posts.userId))
    .orderBy(desc(posts.createdAt));
  if (!results.length) {
    return error(404, 'Post or User not found');
  }
  console.log('size =', results.length);

  if (results.length > 0) {
    const user = results[0].user;
    const posts = results.map((r) => r.post);
    return { user, posts };
  }
  return {
    user: undefined,
    posts: undefined,
  };
}
