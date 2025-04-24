<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CallOut from '$lib/components/CallOut.svelte';
	import { formatDate } from '$lib/utils/dates';
	import SignInIcon from '~icons/mdi/account';
	import GuideIcon from '~icons/mdi/book-open-page-variant';
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import NotesIcon from '~icons/mdi/note-text';

	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl p-4 py-8 sm:py-12">
	<div class="text-center">
		<h1 class="text-3xl font-bold sm:text-4xl">Welcome to RetroPad</h1>
		<p class="mt-4 text-lg text-zinc-400">Your digital companion for game notes and guides</p>
		{#if !data.session}
			<a
				href="/login/google"
				class="mt-6 inline-flex items-center gap-2 rounded-md bg-purple-700 px-6 py-2 font-medium text-white hover:bg-purple-600"
			>
				<SignInIcon class="h-5 w-5" />
				Sign in with Google
			</a>
		{/if}
	</div>

	<div class="mt-12">
		<h2 class="text-xl font-semibold">What can you use RetroPad for?</h2>

		<div class="mt-6 grid gap-4 sm:grid-cols-2">
			<div class="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-purple-900/50"
				>
					<GuideIcon class="h-6 w-6 text-purple-400" />
				</div>
				<div>
					<h3 class="font-medium">Game Guides</h3>
					<p class="mt-1 text-sm text-zinc-400">
						Create detailed walkthroughs, quest guides, or strategy tips for your favorite games
					</p>
				</div>
			</div>

			<div class="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-purple-900/50"
				>
					<NotesIcon class="h-6 w-6 text-purple-400" />
				</div>
				<div>
					<h3 class="font-medium">Personal Notes</h3>
					<p class="mt-1 text-sm text-zinc-400">
						Keep track of your progress, achievements, or things to remember for later
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
