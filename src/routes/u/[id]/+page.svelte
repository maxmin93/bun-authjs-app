<script lang="ts">
  import PostView from '$lib/components/PostView.svelte';
  import type { PostType } from '$lib/schema/post';
  import type { UserType } from '$lib/schema/auth';

  export let data;

  const user: UserType | undefined = data.user;
  const posts: PostType[] = data.posts ?? [];
</script>

{#if user}
  {#each posts as post}
    <PostView {post} {user} />
  {/each}
{:else}
  <p>This user hasn't posted anything yet.</p>
{/if}
