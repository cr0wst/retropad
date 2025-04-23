<script lang="ts">
	import AddIcon from '~icons/mdi/plus';
	import GamepadIcon from '~icons/mdi/gamepad-square';
	import { superForm } from 'sveltekit-superforms/client';
	let { data } = $props();

	// Client API:
	const { form, enhance, errors, message } = superForm(data.form);
</script>

<div class="space-y-6">
	<div class="flex items-center gap-2">
		<GamepadIcon class="h-8 w-8 text-purple-400" />
		<h1 class="text-3xl font-bold text-purple-100">Create Pad</h1>
	</div>

	<div
		class="relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 p-6 shadow-lg"
	>
		<!-- Pattern overlay -->
		<div class="bg-grid-white/[0.03] absolute inset-0 bg-[length:20px_20px]"></div>

		<form class="relative space-y-6" method="POST" use:enhance>
			<div class="flex flex-col gap-2">
				<label for="name" class="font-medium text-purple-200">Name (required)</label>
				{#if $errors.name}
					<p class="flex items-center text-sm font-medium text-red-400">
						<span class="i-mdi-alert-circle mr-1"></span>
						{$errors.name}
					</p>
				{/if}
				<input
					type="text"
					id="name"
					name="name"
					bind:value={$form.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					class="rounded-md border {$errors.name
						? 'border-red-500/70'
						: 'border-zinc-700'} bg-zinc-900/60 p-2 text-white placeholder-zinc-400 shadow-inner shadow-zinc-950 transition-all duration-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/50 focus:outline-none"
					placeholder="Enter the name of your Pad"
				/>
				{#if !$errors.name}
					<p class="text-xs text-zinc-400">Maximum 50 characters</p>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<label for="description" class="font-medium text-purple-200">Description</label>
				{#if $errors.description}
					<p class="flex items-center text-sm font-medium text-red-400">
						<span class="i-mdi-alert-circle mr-1"></span>
						{$errors.description}
					</p>
				{/if}
				<textarea
					id="description"
					name="description"
					bind:value={$form.description}
					aria-invalid={$errors.description ? 'true' : undefined}
					rows="4"
					class="rounded-md border {$errors.description
						? 'border-red-500/70'
						: 'border-zinc-700'} bg-zinc-900/60 p-2 text-white placeholder-zinc-400 shadow-inner shadow-zinc-950 transition-all duration-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/50 focus:outline-none"
					placeholder="What's this Pad about? (optional)"
				></textarea>
				{#if !$errors.description}
					<p class="text-xs text-zinc-400">Maximum 500 characters</p>
				{/if}
			</div>
			<div class="flex justify-end">
				<button
					class="flex items-center gap-2 rounded-md border border-zinc-700 bg-gradient-to-r from-purple-800 to-purple-700 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-600 hover:shadow-xl focus:ring-2 focus:ring-zinc-600/50 focus:outline-none active:translate-y-0.5"
					type="submit"
				>
					<AddIcon class="h-5 w-5" />
					Create Pad
				</button>
			</div>
		</form>
	</div>
</div>
