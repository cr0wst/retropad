<script lang="ts">
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import BookmarkIcon from '~icons/mdi/bookmark';
	import MenuIcon from '~icons/mdi/menu';
	import ChevronRightIcon from '~icons/mdi/chevron-right';
	import { onMount } from 'svelte';

	// Define the types to fix TypeScript errors
	type Bookmark = {
		id: string;
		line: number;
		label: string;
		color: string;
	};

	type Note = {
		id: string;
		title: string;
		content: string;
		tags: string[];
		bookmarks: Bookmark[];
		createdAt: string;
		updatedAt: string;
	};

	// Color mapping helper
	function getColorValue(color: string): string {
		const colorMap: Record<string, string> = {
			red: '#ef4444',
			blue: '#3b82f6',
			green: '#10b981',
			purple: '#8b5cf6',
			orange: '#f97316',
			teal: '#14b8a6'
		};
		return colorMap[color] || '#8b5cf6';
	}

	let { data } = $props();

	// Use the pad data from the server
	const pad = $derived(data.pad);
	const notes = $derived<Note[]>(data.notes || []);

	// UI state
	let sidebarVisible = $state(true);
	let isDesktop = $state(true);
	let dropdownVisible = $state(false);
	let initialLoad = $state(true);

	// Check if we're on desktop
	$effect(() => {
		if (typeof window !== 'undefined') {
			const checkIfDesktop = () => {
				const wasDesktop = isDesktop;
				isDesktop = window.innerWidth >= 768;

				// Only update sidebar visibility on initial load, not on resize
				if (initialLoad) {
					initialLoad = false;
				}
			};

			checkIfDesktop();
			window.addEventListener('resize', checkIfDesktop);

			return () => {
				window.removeEventListener('resize', checkIfDesktop);
			};
		}
	});

	// Initialize with a string
	let activeNoteId = $state('');

	// Update activeNoteId when notes change
	$effect(() => {
		if (notes.length > 0) {
			// If current ID is not valid or not set, use the first note
			if (!activeNoteId || !notes.some((note) => note.id === activeNoteId)) {
				activeNoteId = notes[0].id;
			}
		}
	});

	// Update body class based on sidebar visibility for mobile
	$effect(() => {
		if (typeof document !== 'undefined') {
			if (sidebarVisible && !isDesktop) {
				document.body.classList.add('sidebar-open');
			} else {
				document.body.classList.remove('sidebar-open');
			}
		}
	});

	// Derived values based on active note
	const activeNote = $derived<Note | undefined>(notes.find((note) => note.id === activeNoteId));

	// Toggle sidebar visibility
	function toggleSidebar(): void {
		sidebarVisible = !sidebarVisible;
	}

	// Toggle bookmark dropdown
	function toggleDropdown(): void {
		dropdownVisible = !dropdownVisible;
	}

	// Set active note
	function setActiveNote(noteId: string): void {
		if (noteId === activeNoteId) return; // No change needed
		activeNoteId = noteId;

		// On mobile, auto-hide sidebar after selection
		if (!isDesktop) {
			sidebarVisible = false;
		}
	}

	// Jump to bookmark
	function jumpToLine(noteId: string, lineNum: number): void {
		// First, make sure we're on the right note
		if (noteId !== activeNoteId) {
			activeNoteId = noteId;
		}

		// Use setTimeout to ensure DOM is updated after possible note change
		setTimeout(() => {
			const element = document.getElementById(`line-${noteId}-${lineNum}`);
			if (element) {
				// Find the container for this note
				const container = document.getElementById(`content-${noteId}`);
				if (container) {
					// Calculate position within the container
					const containerTop = container.getBoundingClientRect().top;
					const elementTop = element.getBoundingClientRect().top;
					const scrollPosition = container.scrollTop + (elementTop - containerTop) - 100;

					// Smooth scroll the container
					container.scrollTo({
						top: scrollPosition,
						behavior: 'smooth'
					});

					// Highlight the line briefly
					element.classList.add('highlight-line');
					setTimeout(() => {
						element.classList.remove('highlight-line');
					}, 1500);
				}
			}

			// Close dropdown
			dropdownVisible = false;
		}, 50);
	}

	// Format date to be more readable
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header with breadcrumb-style navigation -->
	<div class="flex items-center justify-between border-b border-zinc-800 bg-black/40 px-4 py-3">
		<div class="flex min-w-0 items-center gap-2">
			<button
				onclick={toggleSidebar}
				class="flex-shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
				aria-label="Toggle Sidebar"
			>
				<MenuIcon class="h-5 w-5" />
			</button>

			<!-- Breadcrumb navigation -->
			<div class="flex min-w-0 items-center gap-1">
				<div class="flex flex-shrink-0 items-center gap-1">
					<GamepadIcon class="h-4 w-4 text-purple-400" />
					<span class="font-medium text-zinc-300">{pad.name}</span>
				</div>

				{#if activeNote}
					<ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-zinc-500" />
					<h1 class="truncate text-lg font-medium text-white">{activeNote.title}</h1>
				{/if}
			</div>
		</div>

		<!-- Bookmark counter badge (if we have an active note with bookmarks) -->
		{#if activeNote && activeNote.bookmarks.length > 0}
			<div class="relative">
				<button
					onclick={toggleDropdown}
					class="flex flex-shrink-0 items-center gap-1 rounded px-2 py-1 hover:bg-zinc-800"
					aria-expanded={dropdownVisible}
					aria-haspopup="true"
				>
					<BookmarkIcon class="h-4 w-4 text-purple-400" />
					<span class="text-xs text-white">{activeNote.bookmarks.length}</span>
				</button>

				<!-- Dropdown for bookmarks (shows only when clicked) -->
				{#if dropdownVisible}
					<div
						class="absolute top-10 right-0 z-30 w-56 rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-lg"
					>
						{#each activeNote.bookmarks as bookmark}
							<button
								onclick={() => jumpToLine(activeNote.id, bookmark.line)}
								class="flex w-full items-center gap-2 rounded px-3 py-2 text-left hover:bg-zinc-800"
							>
								<span
									class="h-2 w-2 rounded-full"
									style={`background-color: ${getColorValue(bookmark.color)}`}
								></span>
								<span class="truncate text-sm text-zinc-200">{bookmark.label}</span>
							</button>
						{/each}
					</div>

					<!-- Click outside to close dropdown -->
					<button
						class="fixed inset-0 z-20 h-full w-full cursor-default bg-transparent"
						onclick={() => (dropdownVisible = false)}
					></button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Main content area -->
	<div class="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
		<!-- Notes sidebar - simple fixed width or hidden -->
		{#if sidebarVisible}
			<aside
				class="hidden w-[280px] overflow-auto border-r border-zinc-800 bg-zinc-900/95 md:block"
			>
				<div class="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
					<h2 class="text-xs font-medium tracking-wider text-zinc-400 uppercase">Notes</h2>
				</div>

				<div>
					{#each notes as note}
						<button
							onclick={() => setActiveNote(note.id)}
							class={`w-full px-4 py-3 text-left hover:bg-zinc-800/50 ${
								note.id === activeNoteId ? 'bg-zinc-800 text-white' : 'text-zinc-300'
							}`}
						>
							<div class="font-medium">{note.title}</div>
							<div class="mt-1 flex items-center justify-between">
								<div class="flex flex-wrap gap-1">
									{#each note.tags.slice(0, 2) as tag}
										<span class="rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
											{tag}
										</span>
									{/each}
									{#if note.tags.length > 2}
										<span class="text-xs text-zinc-500">+{note.tags.length - 2}</span>
									{/if}
								</div>
								<span class="text-xs text-zinc-500">{formatDate(note.updatedAt)}</span>
							</div>
						</button>
					{/each}
				</div>
			</aside>
		{/if}

		<!-- Mobile sidebar - overlay version -->
		{#if sidebarVisible && !isDesktop}
			<div
				class="fixed inset-0 z-20 mt-[105px] h-[calc(100vh-105px)] w-[280px] overflow-auto border-r border-zinc-800 bg-zinc-900/95"
			>
				<div class="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
					<h2 class="text-xs font-medium tracking-wider text-zinc-400 uppercase">Notes</h2>
				</div>

				<div>
					{#each notes as note}
						<button
							onclick={() => setActiveNote(note.id)}
							class={`w-full px-4 py-3 text-left hover:bg-zinc-800/50 ${
								note.id === activeNoteId ? 'bg-zinc-800 text-white' : 'text-zinc-300'
							}`}
						>
							<div class="font-medium">{note.title}</div>
							<div class="mt-1 flex items-center justify-between">
								<div class="flex flex-wrap gap-1">
									{#each note.tags.slice(0, 2) as tag}
										<span class="rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
											{tag}
										</span>
									{/each}
									{#if note.tags.length > 2}
										<span class="text-xs text-zinc-500">+{note.tags.length - 2}</span>
									{/if}
								</div>
								<span class="text-xs text-zinc-500">{formatDate(note.updatedAt)}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Content area with note display - use the "display: none" approach -->
		<main class="flex-1 overflow-hidden">
			{#if notes.length > 0}
				{#each notes as note}
					<div
						id={`content-${note.id}`}
						class="h-full overflow-auto bg-zinc-950 font-mono text-sm md:text-base"
						style={note.id === activeNoteId ? '' : 'display: none;'}
					>
						<div class="flex flex-col pb-8">
							{#each note.content.split('\n') as line, i}
								<div id={`line-${note.id}-${i}`} class="highlight-target flex hover:bg-zinc-900/40">
									<span
										class="w-10 shrink-0 border-r border-zinc-800 bg-zinc-900/30 px-2 text-right text-zinc-600 select-none md:w-12"
									>
										{i + 1}
									</span>
									<span class="px-3 py-1 whitespace-pre text-white">{line}</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex h-full items-center justify-center bg-zinc-950">
					<p class="text-zinc-500">No notes available</p>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.highlight-target.highlight-line {
		animation: highlight 1.5s ease-in-out;
	}

	@keyframes highlight {
		0%,
		100% {
			background-color: rgba(124, 58, 237, 0);
		}
		50% {
			background-color: rgba(124, 58, 237, 0.2);
		}
	}

	/* Add mobile backdrop for sidebar */
	@media (max-width: 768px) {
		:global(.sidebar-open) {
			overflow: hidden;
		}

		:global(.sidebar-open::before) {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 10;
		}
	}
</style>
