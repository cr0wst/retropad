<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { type = 'text', value = '', disabled = false, error = false } = $props();

	const inputClass = $derived(
		cn(
			'flex h-10 w-full rounded-md border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-400 shadow-inner shadow-zinc-950 transition-all duration-200',
			error
				? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/50'
				: 'border-zinc-700 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/50',
			'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
		)
	);
</script>

<input {type} {disabled} bind:value class={inputClass} {...$$restProps} />
