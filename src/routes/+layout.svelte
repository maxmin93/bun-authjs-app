<script lang="ts">
  import { signIn, signOut } from '@auth/sveltekit/client';
  import '../app.postcss';

  export let data;
  const user = data.session?.user;

  // $: console.log(user);

  let show_menu = false;
</script>

<main class="flex flex-col w-full h-full min-w-screen min-h-screen p-16 gap-8">
  <section class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/">
        <button class="btn btn-ghost normal-case text-white text-2xl font-bold"
          >Twitter</button
        >
      </a>
    </div>

    <div class="flex-none">
      {#if !user}
        <button
          on:click={() => signIn('discord', { callbackUrl: '/' })}
          class="btn btn-primary"
        >
          Log in with Discord
        </button>
      {:else}
        <div class="flex flex-row justify-center gap-8">
          {#if show_menu}
            <button
              on:click={() => signOut({ callbackUrl: '/' })}
              class="btn btn-outline btn-error"
            >
              Log out
            </button>
          {/if}
          <button
            on:click={() => (show_menu = !show_menu)}
            class="btn btn-ghost btn-circle avatar"
          >
            <img
              src={user.image}
              alt={`${user.name} Profile Picture`}
              class="w-16 h-16 rounded-full"
            />
          </button>
        </div>
      {/if}
    </div>
  </section>

  <slot />
</main>
