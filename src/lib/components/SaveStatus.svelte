<!--
  This component shows the current save status of a note.
  It displays different icons and text based on whether the note is:
  - saved (checkmark)
  - saving (spinner)
  - error (x)
-->
<script lang="ts">
	import CheckIcon from '~icons/mdi/check-circle';
	import LoadingIcon from '~icons/mdi/loading';
	import ErrorIcon from '~icons/mdi/alert-circle';
	import { getLastSaveTime, getSaveStatus } from '$lib/stores/notes.svelte';

	// Format the last save time in a human-readable way
	function formatLastSave(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp;

		if (diff < 1000) return 'Just now';
		if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
		if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
		if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
		return new Date(timestamp).toLocaleString();
	}

	// Derived values for the component
	const status = $derived(getSaveStatus());
	const lastSave = $derived(formatLastSave(getLastSaveTime()));
</script>

<div class="flex items-center gap-2 text-sm">
	{#if status === 'saved'}
		<CheckIcon class="h-5 w-5 text-green-500" />
		<span class="text-zinc-400">Saved {lastSave}</span>
	{:else if status === 'saving'}
		<LoadingIcon class="h-5 w-5 animate-spin text-blue-500" />
		<span class="text-zinc-400">Saving...</span>
	{:else}
		<ErrorIcon class="h-5 w-5 text-red-500" />
		<span class="text-red-400">Error saving</span>
	{/if}
</div>
