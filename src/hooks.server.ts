import { SvelteKitAuth } from '@auth/sveltekit';
import Discord from '@auth/core/providers/discord';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/drizzle';

const authorization = (async ({ event, resolve }) => {
  // Protect any routes under `/authenticated`
  const path = event.url.pathname;
  if (path.startsWith('/u/') || path.startsWith('/p/')) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, '/login');
    }
  }
  // If the request is still here, just proceed as normally
  return resolve(event);
}) satisfies Handle;

// https://github.com/zeucapua/veranda-app/blob/master/src/hooks.server.ts
const auth = (async (...args) => {
  const [{ event }] = args;
  return SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [
      Discord({
        clientId: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ user, session }) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };

        event.locals.session = session;
        return session;
      },
    },
  })(...args);
}) satisfies Handle;

// https://authjs.dev/reference/sveltekit
// SvelteKitAuth
// - providers: [ Discord ]
// - adapter: DrizzleAdapter
// - pages: { signIn, signOut }
export const handle: Handle = sequence(auth, authorization);
