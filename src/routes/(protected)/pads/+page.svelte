<script lang="ts">
	import CallOut from '$lib/components/CallOut.svelte';
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import TrashIcon from '~icons/mdi/trash';
	import { formatDate } from '$lib/utils/dates';
	import AddIcon from '~icons/mdi/plus';

	let { data } = $props();

	let pads = $state(data.pads || []);

	// Use the pads data loaded from the server
	interface Pad {
		id: string;
		ownerId: string;
		name: string;
		description: string | null;
		updatedAt: Date;
		createdAt: Date;
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

{#if pads.length > 0}
	<div class="flex flex-col gap-6">
		<header>
			<h1 class="text-2xl font-bold">Your Pads</h1>
			<p class="text-zinc-400">Browse and manage your collection of game notes</p>
		</header>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each pads as pad}
				<div class="group relative">
					<a
						href={`/pads/${pad.id}`}
						class="block rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-purple-800 hover:bg-zinc-900/80"
					>
						<div class="mb-3 flex items-start justify-between gap-4">
							<div class="flex min-w-0 items-center gap-3">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-900/50"
								>
									<GamepadIcon class="h-5 w-5 text-purple-400" />
								</div>
								<div class="min-w-0">
									<h3 class="truncate text-lg font-medium text-white">{pad.name}</h3>
									{#if pad.description}
										<p class="line-clamp-1 text-sm text-zinc-400">{pad.description}</p>
									{/if}
								</div>
							</div>
							<button
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (
										confirm(
											'Are you sure you want to delete this pad? This action cannot be undone.'
										)
									) {
										deletePad(pad.id);
									}
								}}
								class="rounded-md bg-zinc-800/50 p-2 text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 sm:shrink-0"
								aria-label="Delete pad"
							>
								<TrashIcon class="h-4 w-4" />
							</button>
						</div>

						{#if pad.updatedAt instanceof Date && !isNaN(pad.updatedAt.getTime())}
							<time
								datetime={pad.updatedAt.toISOString()}
								class="text-xs text-zinc-500"
								title={pad.updatedAt.toLocaleString()}
							>
								Updated {formatDate(pad.updatedAt)}
							</time>
						{/if}
					</a>
				</div>
			{/each}
		</div>

		<div class="flex justify-center sm:justify-start">
			<a
				href="/pads/create"
				class="flex items-center gap-2 rounded-md bg-purple-700/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
			>
				<AddIcon class="h-4 w-4" />
				Create New Pad
			</a>
		</div>
	</div>
{:else}
	<div class="flex min-h-[50vh] flex-col items-center justify-center">
		<div class="text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/50"
			>
				<GamepadIcon class="h-8 w-8 text-purple-400" />
			</div>
			<h1 class="text-2xl font-bold">Start Your Collection</h1>
			<p class="mt-2 text-zinc-400">Create your first pad to begin organizing your game notes</p>

			<div class="mt-8 max-w-xl">
				<CallOut
					title="What is a Pad?"
					content="A Pad is a collection of notes about a game. It can be used to store FAQs, walkthroughs, and your own gaming notes."
				/>
			</div>

			<a
				href="/pads/create"
				class="mt-8 inline-flex items-center gap-2 rounded-md bg-purple-700 px-6 py-2 font-medium text-white hover:bg-purple-600"
			>
				<AddIcon class="h-5 w-5" />
				Create Your First Pad
			</a>
		</div>
	</div>
{/if}
