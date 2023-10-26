import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/drizzle';
import { users } from '$lib/schema/auth';
import { posts, type PostType } from '$lib/schema/post';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const latestPosts = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return {
    posts: latestPosts,
  };
};

export const actions = {
  createPost: async ({ locals, request }) => {
    const data = await request.formData();
    const content = data.get('content')?.toString();

    const session = await locals.getSession();
    const user = session?.user;

    if (user && content) {
      const results = await db
        .insert(posts)
        .values({
          content,
          userId: user.id,
        } as PostType)
        .returning();
      const postData = results.shift(); // pick first of array
      console.log('after saving post:', postData);

      if (!postData) {
        throw fail(503, {
          message: "There's been an error when posting. Try again.",
        });
      }
    }
  },
  clapPost: async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {
      return fail(502, { message: 'You need to login for update claps.' });
    }

    const data = await request.formData();
    const post_id = String(data.get('post_id'));

    const post = await db.select().from(posts).where(eq(posts.id, post_id));
    if (post.length > 0 && post[0]) {
      const claps = post.shift()!.claps ?? 0;
      await db
        .update(posts)
        .set({ claps: claps + 1 })
        .where(eq(posts.id, post_id));
      return { success: true, claps: claps + 1 };
    }
    // return { success: false };
    return fail(502, { message: 'Cannot clap right now. Try again.' });
  },
};
