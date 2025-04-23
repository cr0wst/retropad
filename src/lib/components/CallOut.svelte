<script lang="ts">
	import InfoIcon from '~icons/mdi/information-outline';

	type Props = {
		title: string;
		content: string;
	};

	const { title, content }: Props = $props();
</script>

<div
	class="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/80 to-purple-800/60 p-6 shadow-md backdrop-blur-sm"
>
	<div class="absolute -top-6 -right-6 opacity-10">
		<InfoIcon class="h-24 w-24 text-purple-300" />
	</div>
	<div class="relative">
		<div class="mb-1 flex items-center gap-2">
			<InfoIcon class="h-5 w-5 text-purple-400" />
			<h3 class="text-lg font-bold text-purple-200">{title}</h3>
		</div>
		<p class="ml-7 text-purple-100/90">{content}</p>
	</div>
</div>
