<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'timeago.js';
  import { enhance } from '$app/forms';
  import type { PostType } from '../schema/post';
  import type { UserType } from '../schema/auth';

  export let post: PostType;
  export let user: UserType;

  let claps: number;
  let duration = post.createdAt ? format(post.createdAt) : 'sometime';

  onMount(() => {
    claps = post.claps ?? 0;
  });

  function updateClaps(value: number) {
    claps = value;
  }

  function onClap() {
    claps += 1;
  }
</script>

<div class="flex flex-row gap-8 items-center">
  <a href={`/u/${user.id}`} class="btn btn-ghost btn-circle avatar">
    <img src={user.image} alt={`${user.name}`} class="w-16 h-16 rounded-full" />
  </a>
  <div class="flex flex-col gap-2">
    <a href={`/p/${post.id}`}>
      <p class="text-neutral-400 pb-2">
        <a href={`/u/${user.id}`}>@{user.name}</a>
        | {duration}
      </p>
      <p class="text-xl text-white">{post.content}</p>
    </a>
    <form
      action="/?/clapPost"
      method="post"
      use:enhance={() => {
        return async ({ result }) => {
          // `result` is an `ActionResult` object
          if (result.type === 'success') {
            console.log('claps.updated =', result.data?.claps);
            updateClaps(Number(result.data?.claps));
          } else {
            // @ts-ignore
            console.log('msg:', result.data?.message);
          }
        };
      }}
    >
      <input type="hidden" name="post_id" value={post.id} />
      <button class="btn btn-outline btn-secondary rounded-full">
        <!-- on:click={onClap} -->
        👏 {#if !claps}...{:else}{claps}{/if}
      </button>
    </form>
  </div>
</div>
