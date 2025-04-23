<script lang="ts">
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import DocumentIcon from '~icons/mdi/file-document-outline';
	import PlusIcon from '~icons/mdi/plus';
	import SearchIcon from '~icons/mdi/magnify';
	import TagIcon from '~icons/mdi/tag-outline';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Mock data for now, would come from the server
	let pads = $state(data.pads || []);
	let searchQuery = $state('');
	let selectedTagFilter = $state<string | null>(null);

	// All unique tags from notes
	const allTags = $derived(() => {
		const tagSet = new Set<string>();
		pads.forEach((pad) => {
			if (pad.tags) {
				pad.tags.forEach((tag) => tagSet.add(tag));
			}
		});
		return Array.from(tagSet);
	});

	// Filtered pads based on search and tag filter
	const filteredPads = $derived(() => {
		return pads.filter((pad) => {
			// Apply search filter
			const matchesSearch =
				searchQuery === '' ||
				pad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(pad.description && pad.description.toLowerCase().includes(searchQuery.toLowerCase()));

			// Apply tag filter
			const matchesTag = !selectedTagFilter || (pad.tags && pad.tags.includes(selectedTagFilter));

			return matchesSearch && matchesTag;
		});
	});

	function navigateToPad(id: string): void {
		goto(`/pads/${id}`);
	}

	function navigateToCreate(): void {
		goto('/pads/create');
	}

	function setTagFilter(tag: string | null): void {
		selectedTagFilter = tag;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<GamepadIcon class="h-8 w-8 text-purple-400" />
			<h1 class="text-2xl font-bold text-purple-100">Your Pads</h1>
		</div>
		<div class="flex gap-2">
			<div class="relative">
				<SearchIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search pads..."
					class="rounded-md border border-zinc-700 bg-zinc-800 py-1.5 pr-4 pl-9 text-sm text-white placeholder-zinc-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
				/>
			</div>
			<button
				onclick={navigateToCreate}
				class="flex items-center gap-1 rounded-md bg-purple-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-600"
			>
				<PlusIcon class="h-4 w-4" />
				New Pad
			</button>
		</div>
	</div>

	{#if allTags.length > 0}
		<div class="flex flex-wrap gap-2">
			<button
				onclick={() => setTagFilter(null)}
				class="rounded-full px-3 py-1 text-xs font-medium {selectedTagFilter === null
					? 'bg-purple-700 text-white'
					: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}"
			>
				All
			</button>
			{#each allTags as tag}
				<button
					onclick={() => setTagFilter(tag)}
					class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium {selectedTagFilter ===
					tag
						? 'bg-purple-700 text-white'
						: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}"
				>
					<TagIcon class="h-3 w-3" />
					{tag}
				</button>
			{/each}
		</div>
	{/if}

	{#if filteredPads.length === 0}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<DocumentIcon class="h-16 w-16 text-zinc-700" />
			<h2 class="mt-4 text-xl font-medium text-zinc-400">No pads found</h2>
			<p class="mt-2 text-zinc-500">
				{searchQuery || selectedTagFilter
					? 'No pads match your current filters'
					: 'Get started by creating your first pad'}
			</p>
			{#if searchQuery || selectedTagFilter}
				<button
					onclick={() => {
						searchQuery = '';
						selectedTagFilter = null;
					}}
					class="mt-4 text-sm text-purple-400 hover:text-purple-300"
				>
					Clear filters
				</button>
			{:else}
				<button
					onclick={navigateToCreate}
					class="mt-4 flex items-center gap-1 rounded-md bg-purple-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-600"
				>
					<PlusIcon class="h-4 w-4" />
					Create a pad
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredPads as pad}
				<div
					class="group cursor-pointer rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800/80 p-4 transition-all duration-200 hover:border-zinc-700 hover:shadow-lg"
					onclick={() => navigateToPad(pad.id)}
				>
					<div class="mb-2 flex items-start justify-between">
						<h3 class="text-lg font-semibold text-white group-hover:text-purple-300">
							{pad.name}
						</h3>
						<DocumentIcon class="h-5 w-5 text-purple-400" />
					</div>

					{#if pad.description}
						<p class="mb-4 line-clamp-2 text-sm text-zinc-400">{pad.description}</p>
					{/if}

					<div class="mt-auto flex justify-between">
						<div class="flex flex-wrap gap-1">
							{#if pad.tags && pad.tags.length > 0}
								{#each pad.tags as tag}
									<span class="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
										{tag}
									</span>
								{/each}
							{/if}
						</div>
						<span class="text-xs text-zinc-500">
							{new Date(pad.updatedAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
