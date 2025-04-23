<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let { htmlFor } = $props();

	const labelClass = $derived(
		cn(
			'text-sm font-medium text-purple-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
		)
	);
</script>

<label for={htmlFor} class={labelClass}>
	<slot />
</label>
