<script lang="ts">
  import PostView from '$lib/components/PostView.svelte';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { page } from '$app/stores';

  export let data;

  const user = $page.data.session?.user;
</script>

<p>
  {#if $page.data.session}
    {#if $page.data.session.user?.image}
      <span
        style="background-image: url('{$page.data.session.user.image}')"
        class="avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? 'User'}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <button
      class="text-red-500"
      on:click={() => signIn('discord', { callbackUrl: '/' })}
      >Sign In with Discord</button
    >
  {/if}
</p>

{#if user}
  <form
    method="POST"
    action="?/createPost"
    class="flex flex-row gap-8 items-center"
  >
    <img
      src={user?.image}
      alt={`${user?.name} Profile Picture`}
      class="w-0 h-0 md:w-16 md:h-16 md:rounded-full"
    />
    <input
      name="content"
      type="text"
      placeholder="Say something..."
      class="grow input input-bordered input-primary"
    />
  </form>
{/if}

<div data-theme="cupcake" class="mt-4">
  <h2>Posts</h2>
  <ul class="list-disc ml-4 mt-4">
    {#each data.posts as row (row.post.id)}
      <PostView user={row.user} post={row.post} />
    {/each}
  </ul>
</div>

<!--
  https://authjs.dev/reference/sveltekit#signing-in-and-signing-out
 -->
<h1>SvelteKit Auth Example</h1>
