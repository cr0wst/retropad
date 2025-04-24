<script lang="ts">
	import { page } from '$app/state';
	import ErrorIcon from '~icons/mdi/alert-circle';
	import HomeIcon from '~icons/mdi/home';
	import BackIcon from '~icons/mdi/arrow-left';
	import { browser } from '$app/environment';

	// Get error details
	const status = $derived(page.status);
	const message = $derived(page.error?.message || getDefaultMessage(status));

	// Default error messages
	function getDefaultMessage(status: number): string {
		switch (status) {
			case 403:
				return "You don't have permission to access this resource";
			case 404:
				return "The page you're looking for doesn't exist";
			case 500:
				return 'Something went wrong on our end';
			default:
				return 'An unexpected error occurred';
		}
	}

	function getErrorTitle(status: number): string {
		switch (status) {
			case 403:
				return 'Access denied';
			case 404:
				return 'Page not found';
			case 500:
				return 'Server error';
			default:
				return 'Error';
		}
	}
</script>

<div class="fixed inset-0 flex items-center justify-center p-4">
	<div class="w-full max-w-md rounded-lg bg-purple-900/20 p-6">
		<div class="flex items-start gap-4">
			<div class="flex-shrink-0">
				<ErrorIcon class="h-6 w-6 text-purple-400" />
			</div>
			<div class="flex-1">
				<h1 class="mb-1 text-lg font-semibold text-purple-100">
					{status} - {getErrorTitle(status)}
				</h1>
				<p class="mb-4 text-sm text-zinc-400">{message}</p>
				<div class="flex gap-3">
					{#if browser}
						<button
							onclick={() => history.back()}
							class="flex items-center gap-1.5 rounded bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-700"
						>
							<BackIcon class="h-4 w-4" />
							Go Back
						</button>
					{/if}
					<a
						href="/"
						class="flex items-center gap-1.5 rounded bg-purple-700 px-3 py-1.5 text-sm text-white hover:bg-purple-600"
					>
						<HomeIcon class="h-4 w-4" />
						Return Home
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
