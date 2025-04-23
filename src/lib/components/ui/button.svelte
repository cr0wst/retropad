<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant = 'default' | 'outline' | 'ghost';
	type ButtonSize = 'default' | 'sm' | 'lg';

	let { variant = 'default', size = 'default', href, type = 'button', disabled = false } = $props();

	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600/50 disabled:pointer-events-none disabled:opacity-50';

	const variants = {
		default:
			'bg-purple-700 text-white hover:bg-purple-600 shadow-lg hover:scale-[1.02] hover:shadow-xl active:translate-y-0.5',
		outline: 'border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800/80',
		ghost: 'hover:bg-zinc-800/80'
	} satisfies Record<ButtonVariant, string>;

	const sizes = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3 text-sm',
		lg: 'h-11 rounded-md px-8'
	} satisfies Record<ButtonSize, string>;

	const buttonClass = $derived(cn(baseStyles, variants[variant], sizes[size]));
</script>

{#if href}
	<a {href} class={buttonClass}>
		<slot />
	</a>
{:else}
	<button {type} {disabled} class={buttonClass}>
		<slot />
	</button>
{/if}
