<script lang="ts">
	import { page } from '$app/stores';
	import AdminIcon from '~icons/mdi/shield-account';
	import BanIcon from '~icons/mdi/account-cancel';
	import type { User } from '$lib/types/schema';

	const users = $state($page.data.users);
</script>

<div>
	<h1 class="mb-6 px-4 text-2xl font-bold text-purple-100 sm:px-0">User Management</h1>

	<!-- Desktop view -->
	<div class="hidden overflow-hidden rounded-lg bg-zinc-800/50 md:block">
		<table class="w-full">
			<thead>
				<tr class="border-b border-zinc-700">
					<th class="px-6 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
					<th class="px-6 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
					<th class="px-6 py-3 text-left text-sm font-medium text-zinc-400">Joined</th>
					<th class="px-6 py-3 text-left text-sm font-medium text-zinc-400">Role</th>
					<th class="px-6 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
					<th class="px-6 py-3 text-right text-sm font-medium text-zinc-400">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-700">
				{#each users as user}
					<tr class="transition-colors hover:bg-zinc-800/30">
						<td class="px-6 py-4 text-sm whitespace-nowrap text-white">{user.name}</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-white">{user.email}</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap text-zinc-400">
							{new Date(user.createdAt).toLocaleDateString()}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap">
							{#if user.isAdmin}
								<span
									class="flex w-fit items-center gap-1.5 rounded-full bg-purple-900/20 px-2 py-1"
								>
									<AdminIcon class="h-4 w-4 text-purple-400" />
									<span class="text-purple-300">Admin</span>
								</span>
							{:else}
								<span class="text-zinc-400">User</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-sm whitespace-nowrap">
							{#if user.isBanned}
								<span class="rounded-full bg-red-900/20 px-2 py-1 text-red-300">Banned</span>
							{:else}
								<span class="rounded-full bg-green-900/20 px-2 py-1 text-green-300">Active</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-right text-sm whitespace-nowrap">
							<a
								href="/admin/users/{user.id}"
								class="rounded bg-purple-900/20 px-3 py-1.5 text-purple-300 transition-colors hover:bg-purple-900/30"
							>
								Manage
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile view -->
	<div class="grid gap-6 md:hidden">
		{#each users as user}
			<div class="rounded-none bg-zinc-800/50 p-6 sm:rounded-lg">
				<div class="mb-3 flex items-center justify-between">
					<div>
						<h3 class="font-medium text-white">{user.name}</h3>
						<p class="text-sm text-zinc-400">{user.email}</p>
					</div>
					<a
						href="/admin/users/{user.id}"
						class="rounded bg-purple-900/20 px-3 py-1.5 text-sm text-purple-300 transition-colors hover:bg-purple-900/30"
					>
						Manage
					</a>
				</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div>
						<p class="text-zinc-400">Joined</p>
						<p class="mt-1 text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
					</div>
					<div>
						<p class="text-zinc-400">Role</p>
						{#if user.isAdmin}
							<span
								class="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-purple-900/20 px-2 py-1"
							>
								<AdminIcon class="h-4 w-4 text-purple-400" />
								<span class="text-purple-300">Admin</span>
							</span>
						{:else}
							<span class="mt-1 text-white">User</span>
						{/if}
					</div>
					<div class="col-span-2">
						<p class="text-zinc-400">Status</p>
						{#if user.isBanned}
							<span class="mt-1 rounded-full bg-red-900/20 px-2 py-1 text-red-300">Banned</span>
						{:else}
							<span class="mt-1 rounded-full bg-green-900/20 px-2 py-1 text-green-300">Active</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
