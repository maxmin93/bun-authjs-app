<script lang="ts">
  import PostView from '$lib/components/PostView.svelte';
  import type { PostType } from '$lib/schema/post';
  import type { UserType } from '$lib/schema/auth';

  export let data;

  const post: PostType | undefined = data.post;
  const user: UserType | undefined = data.user;
</script>

{#if post && user}
  <PostView {user} {post} />
{:else}
  <p>This user hasn't posted anything yet.</p>
{/if}
