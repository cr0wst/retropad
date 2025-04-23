<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import PagesIcon from '~icons/mdi/book-open-page-variant';
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import SignInIcon from '~icons/mdi/account';
	import ComingSoonWrapper from '$lib/components/coming-soon/ComingSoonWrapper.svelte';
	import CallOut from '$lib/components/CallOut.svelte';
	import TrashIcon from '~icons/mdi/trash';
	import { formatDate } from '$lib/utils/dates';

	// Use the pads data loaded from the server
	interface Pad {
		id: string;
		ownerId: string;
		name: string;
		description: string | null;
		updatedAt: Date;
		createdAt: Date;
		tags: string[];
	}

	let { data } = $props();
	let pads = $state(data.pads || []);

	function navigateToPad(id: string): void {
		goto(`/pads/${id}`);
	}

	function navigateToCreate(): void {
		goto('/pads/create');
	}

	// Add delete function
	async function deletePad(id: string) {
		try {
			const response = await fetch(`/api/pads/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete pad');
			}

			// Remove the pad from local state
			pads = pads.filter((pad) => pad.id !== id);
		} catch (error) {
			console.error('Error deleting pad:', error);
			// TODO: Show error toast or notification
		}
	}
</script>

{#if page.data.session}
	{#if pads.length > 0}
		<div class="mx-auto max-w-4xl py-6">
			<h1 class="text-2xl font-bold">Welcome Back!</h1>
			<p class="mb-6 text-zinc-400">Ready to get back to gaming? Here's where you left off.</p>

			<div class="grid gap-4 md:grid-cols-2">
				{#each pads as pad}
					<div class="group relative">
						<a
							href={`/pads/${pad.id}`}
							class="block cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-purple-800 hover:bg-zinc-900"
						>
							<div class="mb-1 flex items-center gap-2">
								<GamepadIcon class="h-5 w-5 text-purple-400" />
								<h3 class="text-lg font-medium text-white">{pad.name}</h3>
							</div>

							{#if pad.description}
								<p class="mb-3 line-clamp-2 text-sm text-zinc-400">{pad.description}</p>
							{/if}

							<div class="flex items-center justify-between">
								<div class="flex flex-wrap gap-1">
									{#each pad.tags.slice(0, 3) as tag}
										<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
											>{tag}</span
										>
									{/each}
									{#if pad.tags.length > 3}
										<span class="text-xs text-zinc-500">+{pad.tags.length - 3}</span>
									{/if}
								</div>
								<span class="text-xs text-zinc-500">
									{formatDate(pad.updatedAt)}
								</span>
							</div>
						</a>
						<button
							onclick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (
									confirm('Are you sure you want to delete this pad? This action cannot be undone.')
								) {
									deletePad(pad.id);
								}
							}}
							class="absolute top-3 right-3 z-10 rounded-md bg-zinc-800/50 p-2 text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
							aria-label="Delete pad"
						>
							<TrashIcon class="h-4 w-4" />
						</button>
					</div>
				{/each}
			</div>

			<div class="mt-6 flex justify-center">
				<button
					onclick={navigateToCreate}
					class="flex items-center gap-2 rounded-md bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-600"
				>
					Create New Pad
				</button>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-2xl py-12 text-center">
			<h1 class="text-2xl font-bold">Welcome to RetroPad!</h1>
			<p class="mt-2 text-zinc-400">You don't have any pads yet. Let's create your first one!</p>

			<div class="mt-8">
				<CallOut
					title="What is a Pad?"
					content="A Pad is a collection of notes about a game. It can be used to store FAQs, walkthroughs, and your own gaming notes."
				/>
			</div>

			<button
				onclick={navigateToCreate}
				class="mx-auto mt-8 flex items-center gap-2 rounded-md bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-600"
			>
				Create Your First Pad
			</button>
		</div>
	{/if}
{:else}
	<div class="flex flex-col justify-center gap-6 py-4 md:gap-8">
		<div class="flex flex-col gap-3 md:gap-4">
			<h1 class="text-3xl font-bold md:text-4xl">
				Your Gaming Notes, <span class="text-purple-500">Organized</span>
			</h1>
			<p class="text-gray-400">
				RetroPad is your digital gaming notebook. Import FAQs, write your own notes, and keep
				everything organized by game. No ads, no distractions - just your gaming notes, your way.
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold md:text-2xl">Features</h2>
			<ul class="grid grid-cols-2 gap-2 text-sm text-gray-400 md:text-base">
				<li>📝 Multiple pages per game</li>
				<li>📚 Import GameFAQs content</li>
				<li>🎮 Organize by game</li>
				<li>✨ Ad-free reading</li>
			</ul>
		</div>

		<div
			class="flex flex-col items-center gap-3 rounded-lg bg-gradient-to-l from-zinc-800/50 to-purple-950/50 p-6 text-center md:gap-4 md:p-8"
		>
			<h2 class="text-xl font-bold md:text-2xl">Ready to Get Started?</h2>
			<p class="text-sm text-gray-400 md:text-base">
				Sign in with your Google account and start organizing your gaming notes today.
			</p>
			<div class="group">
				<a
					href="/login/google"
					class="mt-2 flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
				>
					<SignInIcon />
					<span>Sign In to Begin</span>
				</a>
			</div>
		</div>
	</div>
{/if}
