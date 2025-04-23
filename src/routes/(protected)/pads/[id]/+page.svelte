<script lang="ts">
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import BookmarkIcon from '~icons/mdi/bookmark';
	import MenuIcon from '~icons/mdi/menu';
	import CloseIcon from '~icons/mdi/close';
	import ChevronRightIcon from '~icons/mdi/chevron-right';
	import PlusIcon from '~icons/mdi/plus';
	import TrashIcon from '~icons/mdi/trash';
	import SpinnerIcon from '~icons/mdi/loading';
	import CheckIcon from '~icons/mdi/check';
	import ErrorIcon from '~icons/mdi/alert';
	import type { Note } from '$lib/stores/notes.svelte';
	import type { NoteOptions } from '$lib/stores/notes.svelte';
	import {
		getNotes,
		getActiveNoteId,
		createNote,
		initNotes,
		setActiveNote,
		updateNote,
		getActiveNote,
		deleteNote,
		getSaveStatus
	} from '$lib/stores/notes.svelte';
	import { createBookmark, deleteBookmark } from '$lib/stores/bookmarks.svelte';
	import { formatDate } from '$lib/utils/dates';
	import { onMount } from 'svelte';

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

	// UI state
	let sidebarVisible = $state(false);
	let isDesktop = $state(true);
	let dropdownVisible = $state(false);
	let initialLoad = $state(true);

	// Store scroll positions for each note
	let noteScrollPositions = $state<Record<string, number>>({});

	// Bookmark dialog state
	let showBookmarkDialog = $state(false);
	let bookmarkLabel = $state('');
	let pendingBookmarkLine = $state<number | null>(null);

	// Track actual line positions for accurate bookmark jumping
	let linePositions = $state<number[]>([]);
	let textareaRef: HTMLTextAreaElement | null = $state(null);

	// Add these to the script section
	let textareaLineCache = $state<Map<number, { top: number; height: number }>>(new Map());

	// Save scroll position when switching notes or updating content
	function saveScrollPosition(noteId: string, scrollTop: number) {
		noteScrollPositions[noteId] = scrollTop;
	}

	// Svelte action to restore scroll position
	function restoreScroll(node: HTMLTextAreaElement, noteId: string | undefined) {
		if (noteId && noteId in noteScrollPositions) {
			node.scrollTop = noteScrollPositions[noteId];
		}

		return {
			update(newNoteId: string | undefined) {
				if (newNoteId && newNoteId in noteScrollPositions) {
					node.scrollTop = noteScrollPositions[newNoteId];
				}
			}
		};
	}

	// Initialize notes from server data
	$effect(() => {
		if (data.notes) {
			console.log(
				'Raw notes from server:',
				data.notes.map((note) => ({
					...note,
					createdAt: note.createdAt,
					updatedAt: note.updatedAt,
					createdAtType: typeof note.createdAt,
					updatedAtType: typeof note.updatedAt,
					createdAtProto: Object.prototype.toString.call(note.createdAt),
					updatedAtProto: Object.prototype.toString.call(note.updatedAt)
				}))
			);

			const convertedNotes = data.notes.map((note) => {
				// Helper function to safely convert to ISO string
				const toSafeISOString = (dateValue: any): string => {
					try {
						// Log the incoming value for debugging
						console.log('Converting date value:', {
							value: dateValue,
							type: typeof dateValue,
							prototype: Object.prototype.toString.call(dateValue)
						});

						// If it's already a valid ISO string, return it
						if (typeof dateValue === 'string' && !isNaN(Date.parse(dateValue))) {
							return dateValue;
						}

						// If it's a number (timestamp), convert from seconds to milliseconds
						if (typeof dateValue === 'number') {
							const date = new Date(dateValue * 1000);
							if (!isNaN(date.getTime())) {
								return date.toISOString();
							}
						}

						// If it's a Date object
						if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
							return dateValue.toISOString();
						}

						// If it's a string that needs parsing
						if (typeof dateValue === 'string') {
							const parsed = new Date(dateValue);
							if (!isNaN(parsed.getTime())) {
								return parsed.toISOString();
							}
						}

						// If it's an object with a timestamp property (SQLite format)
						if (dateValue && typeof dateValue === 'object' && 'timestamp' in dateValue) {
							const timestamp = Number(dateValue.timestamp);
							if (!isNaN(timestamp)) {
								const date = new Date(timestamp * 1000);
								if (!isNaN(date.getTime())) {
									return date.toISOString();
								}
							}
						}

						// If all else fails, use current time
						console.warn('Invalid date value, using current time:', dateValue);
						return new Date().toISOString();
					} catch (error) {
						console.error('Error converting date:', error, dateValue);
						return new Date().toISOString();
					}
				};

				// Convert bookmarks to ensure createdAt is a Date
				const convertedBookmarks = note.bookmarks?.map((bookmark) => ({
					...bookmark,
					createdAt:
						bookmark.createdAt instanceof Date ? bookmark.createdAt : new Date(bookmark.createdAt)
				}));

				// Parse options from string if needed
				const parsedOptions =
					typeof note.options === 'string'
						? (JSON.parse(note.options) as NoteOptions)
						: note.options || { wordWrap: true };

				// Create a BaseNote object
				const baseNote = {
					...note,
					padId: pad.id,
					sortOrder: 0,
					tags: note.tags || undefined,
					createdAt: toSafeISOString(note.createdAt),
					updatedAt: toSafeISOString(note.updatedAt),
					options: parsedOptions,
					bookmarks: convertedBookmarks
				};

				console.log('Converted note:', {
					id: baseNote.id,
					createdAt: baseNote.createdAt,
					updatedAt: baseNote.updatedAt,
					options: baseNote.options,
					bookmarks: baseNote.bookmarks
				});

				return baseNote;
			});

			initNotes(convertedNotes);
		}
	});

	// Effect to handle window resize and sidebar visibility
	$effect(() => {
		if (typeof window !== 'undefined') {
			const checkIfDesktop = () => {
				const wasDesktop = isDesktop;
				isDesktop = window.innerWidth >= 768;

				// Only auto-open sidebar when switching to desktop
				if (!wasDesktop && isDesktop) {
					sidebarVisible = true;
				}
				// Auto-close sidebar when switching to mobile
				else if (wasDesktop && !isDesktop) {
					sidebarVisible = false;
				}
			};

			checkIfDesktop();
			window.addEventListener('resize', checkIfDesktop);

			return () => {
				window.removeEventListener('resize', checkIfDesktop);
			};
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

	// Toggle sidebar visibility (only on mobile)
	function toggleSidebar(): void {
		if (!isDesktop) {
			sidebarVisible = !sidebarVisible;
		}
	}

	// Toggle bookmark dropdown
	function toggleDropdown(): void {
		dropdownVisible = !dropdownVisible;
	}

	// Handle new note creation
	function handleNewNote(): void {
		createNote(pad.id);
		if (!isDesktop) {
			sidebarVisible = false;
		}
	}

	// Handle note selection with scroll position management
	function handleNoteSelect(noteId: string): void {
		if (noteId === getActiveNoteId()) return; // No change needed

		// Save current note's scroll position before switching
		const currentNote = getActiveNote();
		if (currentNote) {
			const textarea = document.querySelector('textarea');
			if (textarea) {
				saveScrollPosition(currentNote.id, textarea.scrollTop);
			}
		}

		setActiveNote(noteId);

		// On mobile, auto-hide sidebar after selection
		if (!isDesktop) {
			sidebarVisible = false;
		}
	}

	// Update the line position calculation
	function updateLinePositions() {
		if (!textareaRef) return;

		const content = textareaRef.value;
		const lines = content.split('\n');
		const positions: number[] = [];
		textareaLineCache.clear();

		// Create a temporary div to measure text
		const measureDiv = document.createElement('div');
		measureDiv.style.cssText = window.getComputedStyle(textareaRef).cssText;
		measureDiv.style.height = 'auto';
		measureDiv.style.position = 'absolute';
		measureDiv.style.visibility = 'hidden';
		measureDiv.style.whiteSpace = getActiveNote()?.options.wordWrap ? 'pre-wrap' : 'pre';
		measureDiv.style.width = `${textareaRef.clientWidth - 40}px`; // Account for padding
		document.body.appendChild(measureDiv);

		let currentPosition = 0;
		lines.forEach((line, index) => {
			measureDiv.textContent = line || ' '; // Use space for empty lines
			const height = measureDiv.offsetHeight;
			positions.push(currentPosition);
			textareaLineCache.set(index, { top: currentPosition, height });
			currentPosition += height;
		});

		document.body.removeChild(measureDiv);
		linePositions = positions;
	}

	// Update the jump to line function
	function jumpToLine(noteId: string, line: number) {
		if (!textareaRef) return;

		const lineInfo = textareaLineCache.get(line - 1);
		if (lineInfo) {
			textareaRef.scrollTop = lineInfo.top;

			// Highlight the line
			const content = textareaRef.value;
			const lines = content.split('\n');
			const lineStart = lines.slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
			const lineEnd = lineStart + lines[line - 1].length;

			textareaRef.setSelectionRange(lineStart, lineEnd);
			setTimeout(() => {
				if (textareaRef) {
					textareaRef.setSelectionRange(lineStart, lineStart);
				}
			}, 1000);
		}
	}

	// Helper to get tags array from string
	function getTagsArray(tags?: string | null): string[] {
		return tags?.split(',').filter(Boolean) ?? [];
	}

	// Toggle word wrap for current note
	function toggleWordWrap() {
		const note = getActiveNote();
		if (note) {
			updateNote(note.id, {
				options: {
					...note.options,
					wordWrap: !note.options.wordWrap
				}
			});
		}
	}

	// Handle bookmark creation
	async function handleBookmarkCreate(lineNumber: number) {
		pendingBookmarkLine = lineNumber;
		bookmarkLabel = `Line ${lineNumber}`;
		showBookmarkDialog = true;
	}

	async function confirmBookmarkCreate() {
		const note = getActiveNote();
		if (note && pendingBookmarkLine !== null) {
			const newBookmark = await createBookmark(note.id, {
				line: pendingBookmarkLine,
				label: bookmarkLabel,
				color: 'purple'
			});

			// Immediately update the note's bookmarks in the local state
			if (newBookmark) {
				const updatedNote = {
					...note,
					bookmarks: [...(note.bookmarks || []), newBookmark]
				};
				updateNote(note.id, { bookmarks: updatedNote.bookmarks });
			}

			showBookmarkDialog = false;
			pendingBookmarkLine = null;
			bookmarkLabel = '';
		}
	}

	function cancelBookmarkCreate() {
		showBookmarkDialog = false;
		pendingBookmarkLine = null;
		bookmarkLabel = '';
	}

	async function handleDeleteBookmark(e: Event, note: Note, bookmarkId: string) {
		e.stopPropagation();
		const success = await deleteBookmark(bookmarkId);

		if (success && note.bookmarks) {
			// Update the note's bookmarks in the local state
			const updatedBookmarks = note.bookmarks.filter((b) => b.id !== bookmarkId);
			updateNote(note.id, { bookmarks: updatedBookmarks });
		}
	}

	// Add resize observer to update line positions when textarea size changes
	$effect(() => {
		if (textareaRef) {
			const resizeObserver = new ResizeObserver(() => {
				updateLinePositions();
			});
			resizeObserver.observe(textareaRef);

			return () => {
				resizeObserver.disconnect();
			};
		}
	});

	// Update line positions when content or word wrap changes
	$effect(() => {
		const note = getActiveNote();
		if (note) {
			updateLinePositions();
		}
	});
</script>

<div class="flex h-full flex-col">
	<!-- Header with breadcrumb-style navigation -->
	<div
		class="flex items-center justify-between border-b border-zinc-800 bg-black/40 px-3 py-2 md:px-4 md:py-3"
	>
		<div class="flex min-w-0 items-center gap-1 md:gap-2">
			<button
				onclick={toggleSidebar}
				class="flex-shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
				aria-label={sidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
			>
				{#if sidebarVisible && !isDesktop}
					<CloseIcon class="h-4 w-4" />
				{:else}
					<MenuIcon class="h-4 w-4" />
				{/if}
			</button>

			<!-- Breadcrumb navigation -->
			<div class="flex min-w-0 items-center gap-1">
				<div class="flex flex-shrink-0 items-center gap-1">
					<GamepadIcon class="h-3 w-3 text-purple-400 md:h-4 md:w-4" />
					<span class="truncate text-sm font-medium text-zinc-300 md:text-base">{pad.name}</span>
				</div>

				{#if getActiveNote()}
					<ChevronRightIcon class="h-4 w-4 flex-shrink-0 text-zinc-500" />
					<h1 class="truncate text-sm font-medium text-white md:text-lg">
						{getActiveNote()?.title}
					</h1>

					<!-- Save status indicator -->
					{#if getActiveNote()}
						<div class="ml-1 flex items-center gap-1 md:ml-2">
							{#if getSaveStatus() === 'saving'}
								<SpinnerIcon class="h-3 w-3 animate-spin text-purple-400" />
								<span class="hidden text-xs text-zinc-500 md:inline">Saving...</span>
							{:else if getSaveStatus() === 'saved'}
								<CheckIcon class="h-3 w-3 text-green-400" />
								<span class="hidden text-xs text-zinc-500 md:inline">Saved</span>
							{:else if getSaveStatus() === 'error'}
								<ErrorIcon class="h-3 w-3 text-red-400" />
								<span class="hidden text-xs text-zinc-500 md:inline">Error saving</span>
							{/if}
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>

	<!-- Main content area -->
	<div class="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
		<!-- Notes sidebar - simple fixed width or hidden -->
		{#if sidebarVisible || isDesktop}
			<aside
				class="hidden w-[280px] overflow-auto border-r border-zinc-800 bg-zinc-900/95 md:block"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3"
				>
					<h2 class="text-xs font-medium tracking-wider text-zinc-400 uppercase">Notes</h2>
					{#if isDesktop}
						<button
							onclick={handleNewNote}
							class="flex items-center gap-1 rounded-md bg-purple-700 px-2 py-1 text-sm font-medium text-white hover:bg-purple-600"
						>
							<PlusIcon class="h-3.5 w-3.5" />
							<span>New Note</span>
						</button>
					{:else}
						<span class="text-xs text-zinc-500">View on desktop to create notes</span>
					{/if}
				</div>

				<div>
					{#each getNotes() as note}
						<div class="group relative">
							<div
								role="button"
								tabindex="0"
								onclick={() => handleNoteSelect(note.id)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleNoteSelect(note.id);
									}
								}}
								class={`w-full px-4 py-3 text-left hover:bg-zinc-800/50 ${
									note.id === getActiveNoteId() ? 'bg-zinc-800 text-white' : 'text-zinc-300'
								}`}
							>
								<div class="flex items-center justify-between pr-8">
									<span class="truncate font-medium">{note.title}</span>
									{#if note.bookmarks?.length}
										<span class="flex flex-shrink-0 items-center gap-1 text-xs text-purple-400">
											<BookmarkIcon class="h-3 w-3" />
											{note.bookmarks.length}
										</span>
									{/if}
								</div>
								<div class="mt-1 flex items-center justify-between">
									<div class="flex flex-wrap gap-1">
										{#each getTagsArray(note.tags) as tag}
											<span class="rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
												{tag}
											</span>
										{/each}
									</div>
									<span class="text-xs text-zinc-500">{formatDate(note.updatedAt)}</span>
								</div>

								<!-- Bookmarks for this note -->
								{#if note.bookmarks?.length}
									<div class="mt-2 space-y-1">
										{#each note.bookmarks as bookmark}
											<div
												role="button"
												tabindex="0"
												onclick={(e) => {
													e.stopPropagation();
													handleNoteSelect(note.id);
													jumpToLine(note.id, bookmark.line);
												}}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleNoteSelect(note.id);
														jumpToLine(note.id, bookmark.line);
													}
												}}
												class="flex items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-zinc-800/50"
											>
												<span
													class="h-2 w-2 flex-shrink-0 rounded-full"
													style={`background-color: ${getColorValue(bookmark.color)}`}
												></span>
												<span class="truncate text-zinc-400">{bookmark.label}</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
							<button
								type="button"
								onclick={() => deleteNote(note.id)}
								class="absolute top-3 right-3 rounded p-1 text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
								aria-label="Delete note"
							>
								<TrashIcon class="h-4 w-4" />
							</button>
						</div>
					{/each}
				</div>
			</aside>
		{/if}

		<!-- Mobile sidebar - overlay version -->
		{#if sidebarVisible && !isDesktop}
			<!-- Backdrop -->
			<button
				type="button"
				class="fixed inset-0 z-10 bg-black/50"
				onclick={() => (sidebarVisible = false)}
				aria-label="Close sidebar"
			></button>

			<div
				class="fixed inset-0 z-20 mt-[105px] h-[calc(100vh-105px)] w-[280px] overflow-auto border-r border-zinc-800 bg-zinc-900/95"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3"
				>
					<h2 class="text-xs font-medium tracking-wider text-zinc-400 uppercase">Notes</h2>
					{#if isDesktop}
						<button
							onclick={handleNewNote}
							class="flex items-center gap-1 rounded-md bg-purple-700 px-2 py-1 text-sm font-medium text-white hover:bg-purple-600"
						>
							<PlusIcon class="h-3.5 w-3.5" />
							<span>New Note</span>
						</button>
					{:else}
						<span class="text-xs text-zinc-500">View on desktop to create notes</span>
					{/if}
				</div>

				<!-- Rest of the mobile sidebar content -->
				<div>
					{#each getNotes() as note}
						<div class="group relative">
							<div
								role="button"
								tabindex="0"
								onclick={() => handleNoteSelect(note.id)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleNoteSelect(note.id);
									}
								}}
								class={`w-full px-4 py-3 text-left hover:bg-zinc-800/50 ${
									note.id === getActiveNoteId() ? 'bg-zinc-800 text-white' : 'text-zinc-300'
								}`}
							>
								<div class="flex items-center justify-between pr-8">
									<span class="truncate font-medium">{note.title}</span>
									{#if note.bookmarks?.length}
										<span class="flex flex-shrink-0 items-center gap-1 text-xs text-purple-400">
											<BookmarkIcon class="h-3 w-3" />
											{note.bookmarks.length}
										</span>
									{/if}
								</div>
								<div class="mt-1 flex items-center justify-between">
									<div class="flex flex-wrap gap-1">
										{#each getTagsArray(note.tags) as tag}
											<span class="rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
												{tag}
											</span>
										{/each}
									</div>
									<span class="text-xs text-zinc-500">{formatDate(note.updatedAt)}</span>
								</div>

								<!-- Bookmarks for this note -->
								{#if note.bookmarks?.length}
									<div class="mt-2 space-y-1">
										{#each note.bookmarks as bookmark}
											<div
												role="button"
												tabindex="0"
												onclick={(e) => {
													e.stopPropagation();
													handleNoteSelect(note.id);
													jumpToLine(note.id, bookmark.line);
												}}
												onkeydown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault();
														e.stopPropagation();
														handleNoteSelect(note.id);
														jumpToLine(note.id, bookmark.line);
													}
												}}
												class="flex items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-zinc-800/50"
											>
												<span
													class="h-2 w-2 flex-shrink-0 rounded-full"
													style={`background-color: ${getColorValue(bookmark.color)}`}
												></span>
												<span class="truncate text-zinc-400">{bookmark.label}</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
							<button
								type="button"
								onclick={() => deleteNote(note.id)}
								class="absolute top-3 right-3 rounded p-1 text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
								aria-label="Delete note"
							>
								<TrashIcon class="h-4 w-4" />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Note content area -->
		{#if getActiveNote()}
			<div class="flex-1 overflow-auto p-4">
				<div class="mx-auto flex max-w-full flex-col gap-4 md:px-4">
					<div class="flex items-center justify-between">
						<input
							type="text"
							value={getActiveNote()?.title ?? ''}
							oninput={(e: Event) => {
								const note = getActiveNote();
								if (note && e.currentTarget instanceof HTMLInputElement) {
									note.title = e.currentTarget.value;
									updateNote(note.id, { title: note.title });
								}
							}}
							class="flex-1 bg-transparent text-2xl font-bold text-white focus:outline-none"
							placeholder="Note title..."
						/>
						<button
							onclick={toggleWordWrap}
							class="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
						>
							{getActiveNote()?.options.wordWrap ? 'Word Wrap: On' : 'Word Wrap: Off'}
						</button>
					</div>
					<div class="relative flex h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)]">
						<!-- Bookmark gutter -->
						<div
							class="relative w-6 flex-shrink-0 overflow-hidden border-r border-zinc-800 bg-zinc-900/80 md:w-8"
							role="complementary"
							aria-label="Bookmark gutter"
						>
							{#if getActiveNote()?.content}
								{#each (getActiveNote()?.content ?? '').split('\n') as line, lineIndex}
									{@const lineInfo = textareaLineCache.get(lineIndex)}
									{#if lineInfo}
										<button
											type="button"
											class="group absolute left-0 flex w-full items-center justify-center transition-colors duration-200"
											style={`top: ${lineInfo.top}px; height: ${lineInfo.height}px;`}
											onclick={() => isDesktop && handleBookmarkCreate(lineIndex + 1)}
											disabled={!isDesktop}
											aria-label={isDesktop
												? getActiveNote()?.bookmarks?.some((b) => b.line === lineIndex + 1)
													? `Edit bookmark at line ${lineIndex + 1}`
													: `Add bookmark at line ${lineIndex + 1}`
												: 'Bookmarks can only be added on desktop'}
										>
											{#if getActiveNote()?.bookmarks?.some((b) => b.line === lineIndex + 1)}
												<button
													type="button"
													class="h-2.5 w-2.5 cursor-pointer rounded-full transition-all duration-200 hover:scale-125"
													style={`background-color: ${getColorValue(
														getActiveNote()?.bookmarks?.find((b) => b.line === lineIndex + 1)
															?.color || 'purple'
													)}`}
													onclick={(e) => {
														e.stopPropagation();
														const bookmark = getActiveNote()?.bookmarks?.find(
															(b) => b.line === lineIndex + 1
														);
														if (bookmark) {
															handleDeleteBookmark(e, getActiveNote()!, bookmark.id);
														}
													}}
													aria-label={`Remove bookmark at line ${lineIndex + 1}`}
												></button>
											{:else if isDesktop}
												<div
													class="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
												>
													<span class="text-xs text-zinc-600">{lineIndex + 1}</span>
													<div class="h-2 w-2 rounded-full bg-purple-500/20"></div>
												</div>
											{/if}
										</button>
									{/if}
								{/each}
							{/if}
						</div>

						<div class="relative flex-1">
							<textarea
								bind:this={textareaRef}
								value={getActiveNote()?.content ?? ''}
								oninput={(e: Event) => {
									const note = getActiveNote();
									if (note && e.currentTarget instanceof HTMLTextAreaElement) {
										note.content = e.currentTarget.value;
										updateNote(note.id, { content: note.content });
										saveScrollPosition(note.id, e.currentTarget.scrollTop);
										updateLinePositions();
									}
								}}
								onscroll={(e: Event) => {
									const note = getActiveNote();
									if (note && e.currentTarget instanceof HTMLTextAreaElement) {
										saveScrollPosition(note.id, e.currentTarget.scrollTop);

										// Sync gutter scroll position
										const gutter = e.currentTarget.parentElement?.previousElementSibling;
										if (gutter) {
											gutter.scrollTop = e.currentTarget.scrollTop;
										}
									}
								}}
								use:restoreScroll={getActiveNote()?.id}
								class="absolute inset-0 resize-none bg-transparent pl-2 font-mono text-white focus:outline-none"
								class:whitespace-pre-wrap={getActiveNote()?.options.wordWrap}
								class:whitespace-pre={!getActiveNote()?.options.wordWrap}
								placeholder="Start writing your note here..."
								style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; line-height: 1.5em;"
							></textarea>
						</div>
					</div>

					<!-- Bookmark creation dialog -->
					{#if showBookmarkDialog}
						<div
							class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
							role="dialog"
							aria-labelledby="bookmark-dialog-title"
							aria-modal="true"
						>
							<div
								class="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl"
								role="document"
							>
								<h3 id="bookmark-dialog-title" class="mb-4 text-lg font-medium text-white">
									Add Bookmark
								</h3>
								<form
									onsubmit={(e) => {
										e.preventDefault();
										confirmBookmarkCreate();
									}}
									class="space-y-4"
								>
									<div class="space-y-2">
										<label for="bookmark-label" class="block text-sm text-zinc-400">Label</label>
										<input
											id="bookmark-label"
											type="text"
											bind:value={bookmarkLabel}
											class="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
											placeholder="Enter bookmark label..."
										/>
									</div>
									<div class="flex justify-end gap-2">
										<button
											type="button"
											onclick={cancelBookmarkCreate}
											class="rounded px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
										>
											Cancel
										</button>
										<button
											type="submit"
											class="rounded bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-500"
										>
											Add Bookmark
										</button>
									</div>
								</form>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="flex flex-1 items-center justify-center text-zinc-500">
				<p>Select a note or create a new one to get started</p>
			</div>
		{/if}
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
