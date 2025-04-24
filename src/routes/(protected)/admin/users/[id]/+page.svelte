<script lang="ts">
	import { page } from '$app/stores';
	import AdminIcon from '~icons/mdi/shield-account';
	import BanIcon from '~icons/mdi/account-cancel';
	import UnbanIcon from '~icons/mdi/account-check';
	import PromoteIcon from '~icons/mdi/account-star';
	import DemoteIcon from '~icons/mdi/account-minus';
	import DeleteIcon from '~icons/mdi/account-remove';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let managedUser = $state($page.data.managedUser);

	$effect(() => {
		managedUser = $page.data.managedUser;
	});

	let banDuration = $state('7'); // Default to 7 days
	let banReason = $state('');
	let showBanForm = $state(false);

	function handleFormSubmit() {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				// If we're deleting the user and got a redirect, follow it
				if (result.data?.redirect) {
					window.location.href = result.data.redirect;
					return;
				}

				// Update the local user data with the returned data
				if (result.data?.user) {
					managedUser = result.data.user;
				}

				// Reset ban form if we were banning
				if (showBanForm) {
					showBanForm = false;
					banDuration = '7';
					banReason = '';
				}

				// Also invalidate all data to ensure everything is in sync
				await invalidateAll();
			}
		};
	}
</script>

<div>
	<div class="mb-6 px-4 sm:px-0">
		<a
			href="/admin/users"
			class="flex w-fit items-center gap-2 text-sm text-purple-400 transition-colors hover:text-purple-300"
		>
			<span>←</span>
			<span>Back to Users</span>
		</a>
		<h1 class="mt-2 text-2xl font-bold text-purple-100">Manage User: {managedUser.name}</h1>
	</div>

	<div class="grid gap-6">
		<!-- User Information -->
		<div class="rounded-none bg-zinc-800/50 p-6 sm:rounded-lg">
			<h2 class="mb-4 text-lg font-semibold text-purple-100">User Information</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<div>
					<p class="text-sm text-zinc-400">Name</p>
					<p class="mt-1 text-white">{managedUser.name}</p>
				</div>
				<div>
					<p class="text-sm text-zinc-400">Email</p>
					<p class="mt-1 text-white">{managedUser.email}</p>
				</div>
				<div>
					<p class="text-sm text-zinc-400">Member Since</p>
					<p class="mt-1 text-white">{new Date(managedUser.createdAt).toLocaleDateString()}</p>
				</div>
				<div>
					<p class="text-sm text-zinc-400">Role</p>
					<p class="mt-1">
						{#if managedUser.isAdmin}
							<span class="flex w-fit items-center gap-1.5 rounded-full bg-purple-900/20 px-2 py-1">
								<AdminIcon class="h-4 w-4 text-purple-400" />
								<span class="text-purple-300">Admin</span>
							</span>
						{:else}
							<span class="text-white">User</span>
						{/if}
					</p>
				</div>
				<div class="sm:col-span-2 lg:col-span-3">
					<p class="text-sm text-zinc-400">Status</p>
					<div class="mt-1 space-y-2">
						{#if managedUser.isBanned}
							<p>
								<span class="rounded-full bg-red-900/20 px-2 py-1 text-red-300">
									Banned
									{#if managedUser.bannedUntil}
										until {new Date(managedUser.bannedUntil).toLocaleDateString()}
									{/if}
								</span>
							</p>
							{#if managedUser.banReason}
								<p class="text-sm text-zinc-400">
									Ban reason: <span class="text-red-300">{managedUser.banReason}</span>
								</p>
							{/if}
						{:else}
							<p>
								<span class="rounded-full bg-green-900/20 px-2 py-1 text-green-300">Active</span>
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Role Management -->
			<div class="rounded-none bg-zinc-800/50 p-6 sm:rounded-lg">
				<h2 class="mb-4 text-lg font-semibold text-purple-100">Role Management</h2>
				<form
					method="POST"
					action="?/{managedUser.isAdmin ? 'demoteUser' : 'promoteUser'}"
					use:enhance={handleFormSubmit}
				>
					<button
						type="submit"
						class="flex w-full items-center gap-2 rounded bg-purple-900/20 px-4 py-2 text-purple-300 transition-colors hover:bg-purple-900/30"
					>
						{#if managedUser.isAdmin}
							<DemoteIcon class="h-5 w-5" />
							Remove Admin Rights
						{:else}
							<PromoteIcon class="h-5 w-5" />
							Promote to Admin
						{/if}
					</button>
				</form>
			</div>

			<!-- Ban Management -->
			<div class="rounded-none bg-zinc-800/50 p-6 sm:col-span-2 sm:rounded-lg lg:col-span-1">
				<h2 class="mb-4 text-lg font-semibold text-purple-100">Ban Management</h2>
				{#if managedUser.isBanned}
					<form method="POST" action="?/unbanUser" use:enhance={handleFormSubmit}>
						<button
							type="submit"
							class="flex w-full items-center gap-2 rounded bg-green-900/20 px-4 py-2 text-green-300 transition-colors hover:bg-green-900/30"
						>
							<UnbanIcon class="h-5 w-5" />
							Unban User
						</button>
					</form>
				{:else if showBanForm}
					<form method="POST" action="?/banUser" use:enhance={handleFormSubmit} class="space-y-4">
						<div>
							<label for="duration" class="mb-1.5 block text-sm text-zinc-400">
								Ban Duration (days)
							</label>
							<input
								type="number"
								id="duration"
								name="duration"
								bind:value={banDuration}
								min="1"
								class="w-full rounded bg-zinc-900/50 px-3 py-2 text-white transition-colors focus:bg-zinc-900/70"
							/>
						</div>
						<div>
							<label for="reason" class="mb-1.5 block text-sm text-zinc-400">Ban Reason</label>
							<textarea
								id="reason"
								name="reason"
								bind:value={banReason}
								rows="3"
								class="w-full rounded bg-zinc-900/50 px-3 py-2 text-white transition-colors focus:bg-zinc-900/70"
							/>
						</div>
						<div class="flex flex-wrap gap-3">
							<button
								type="submit"
								class="flex items-center gap-2 rounded bg-red-900/20 px-4 py-2 text-red-300 transition-colors hover:bg-red-900/30"
							>
								<BanIcon class="h-5 w-5" />
								Ban User
							</button>
							<button
								type="button"
								onclick={() => (showBanForm = false)}
								class="rounded bg-zinc-700/50 px-4 py-2 text-white transition-colors hover:bg-zinc-700/70"
							>
								Cancel
							</button>
						</div>
					</form>
				{:else}
					<button
						onclick={() => (showBanForm = true)}
						class="flex w-full items-center gap-2 rounded bg-red-900/20 px-4 py-2 text-red-300 transition-colors hover:bg-red-900/30"
					>
						<BanIcon class="h-5 w-5" />
						Ban User
					</button>
				{/if}
			</div>

			<!-- Danger Zone -->
			<div class="rounded-none bg-red-900/20 p-6 sm:rounded-lg">
				<h2 class="mb-4 text-lg font-semibold text-red-300">Danger Zone</h2>
				<form method="POST" action="?/deleteUser" use:enhance={handleFormSubmit}>
					<button
						type="submit"
						class="flex w-full items-center gap-2 rounded bg-red-900/20 px-4 py-2 text-red-300 transition-colors hover:bg-red-900/30"
					>
						<DeleteIcon class="h-5 w-5" />
						Delete User Account
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
