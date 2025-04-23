<script lang="ts">
	let { children } = $props();
	let tooltipVisible = $state(false);
	let tooltipId = `tooltip-${Math.random().toString(36).slice(2)}`;
	let mouseX = $state(0);
	let mouseY = $state(0);
	let tooltipElement: HTMLElement | null = null;

	function updateTooltipPosition(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;

		if (tooltipElement) {
			const rect = tooltipElement.getBoundingClientRect();
			const viewportWidth = window.innerWidth;

			// If tooltip would overflow right edge, show it on the left side instead
			if (mouseX + rect.width + 12 > viewportWidth) {
				tooltipElement.style.left = `${mouseX - rect.width - 12}px`;
			} else {
				tooltipElement.style.left = `${mouseX + 12}px`;
			}
			tooltipElement.style.top = `${mouseY - rect.height / 2}px`;
		}
	}
</script>

<div class="contents">
	<button
		type="button"
		class="group contents"
		aria-describedby={tooltipId}
		aria-disabled="true"
		onmouseenter={() => (tooltipVisible = true)}
		onmouseleave={() => (tooltipVisible = false)}
		onmousemove={updateTooltipPosition}
		onclick={(e) => e.preventDefault()}
		onkeydown={(e) => e.key === 'Enter' && e.preventDefault()}
	>
		<div class="contents [&_*]:cursor-not-allowed">
			{@render children()}
		</div>
	</button>

	{#if tooltipVisible}
		<div
			bind:this={tooltipElement}
			id={tooltipId}
			role="tooltip"
			aria-hidden={!tooltipVisible}
			class="pointer-events-none fixed z-50 rounded bg-zinc-800/90 px-2 py-1 text-sm whitespace-nowrap text-white shadow-lg"
		>
			This feature is not yet implemented
		</div>
	{/if}
</div>
