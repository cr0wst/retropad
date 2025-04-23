<script lang="ts">
	import { page } from '$app/state';
	import UsersIcon from '~icons/mdi/account-group';
	import AdminIcon from '~icons/mdi/shield-account';
	import SessionIcon from '~icons/mdi/login-variant';

	const { data } = page;
	const { statistics } = data;
</script>

<div class="mx-auto max-w-7xl">
	<h1 class="mb-6 text-2xl font-bold text-purple-100">Admin Dashboard</h1>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Users Stat Card -->
		<div class="rounded-lg bg-gradient-to-br from-purple-900/60 to-purple-800/40 p-6 shadow-lg">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-purple-300 uppercase">Total Users</p>
					<p class="text-3xl font-bold text-white">{statistics.totalUsers}</p>
				</div>
				<div class="rounded-full bg-purple-500/20 p-3">
					<UsersIcon class="h-8 w-8 text-purple-300" />
				</div>
			</div>
		</div>

		<!-- Admin Users Stat Card -->
		<div class="rounded-lg bg-gradient-to-br from-indigo-900/60 to-indigo-800/40 p-6 shadow-lg">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-indigo-300 uppercase">Admin Users</p>
					<p class="text-3xl font-bold text-white">{statistics.totalAdmins}</p>
				</div>
				<div class="rounded-full bg-indigo-500/20 p-3">
					<AdminIcon class="h-8 w-8 text-indigo-300" />
				</div>
			</div>
		</div>

		<!-- Sessions Stat Card -->
		<div class="rounded-lg bg-gradient-to-br from-violet-900/60 to-violet-800/40 p-6 shadow-lg">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-violet-300 uppercase">Active Sessions</p>
					<p class="text-3xl font-bold text-white">{statistics.totalSessions}</p>
				</div>
				<div class="rounded-full bg-violet-500/20 p-3">
					<SessionIcon class="h-8 w-8 text-violet-300" />
				</div>
			</div>
		</div>
	</div>

	<!-- Additional dashboard sections can be added here -->
	<div class="mb-6 rounded-lg bg-zinc-800/50 p-6">
		<h2 class="mb-4 text-xl font-bold text-purple-100">System Status</h2>
		<div class="grid grid-cols-2 gap-4">
			<div class="flex items-center">
				<div class="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
				<span class="text-green-300">System Online</span>
			</div>
			<div class="flex items-center">
				<div class="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
				<span class="text-green-300">Database Connected</span>
			</div>
		</div>
	</div>
</div>
