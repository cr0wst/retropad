<script lang="ts">
	import '../app.css';
	import AddIcon from '~icons/mdi/plus';
	import AdminButtonIcon from '~icons/mdi/cog-outline';
	import AdminIcon from '~icons/mdi/shield-check';
	import Logo from '~icons/mdi/gamepad-round-left';
	import MenuIcon from '~icons/mdi/menu';
	import { page } from '$app/state';
	let { children } = $props();

	// Check if we're on a pad view page
	const isPadView = $derived(page.route.id?.startsWith('/(protected)/pads/[id]') || false);

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<svelte:head>
	<title>RetroPad - Your Digital Gaming Notebook</title>
	<meta
		name="description"
		content="RetroPad is like your vintage gaming binder brought into the modern world. Organize your game notes, and collaborate with others."
	/>
	<!-- Primary Meta Tags -->
	<meta name="title" content="RetroPad - Your Digital Gaming Notebook" />
	<link rel="canonical" href="https://retropad.io" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

	<!-- Mobile Specific -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#581c87" />
	<!-- Purple-950 from Tailwind -->

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://retropad.io" />
	<meta property="og:title" content="RetroPad - Your Digital Gaming Notebook" />
	<meta
		property="og:description"
		content="RetroPad is like your vintage gaming binder brought into the modern world. Organize your game notes, and collaborate with others."
	/>
	<meta property="og:site_name" content="RetroPad" />
	<meta property="og:image" content="https://retropad.io/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://retropad.io" />
	<meta property="twitter:title" content="RetroPad - Your Digital Gaming Notebook" />
	<meta
		property="twitter:description"
		content="RetroPad is like your vintage gaming binder brought into the modern world. Organize your game notes, and collaborate with others."
	/>
	<meta property="twitter:image" content="https://retropad.io/og-image.png" />
</svelte:head>

<div class="flex h-[100dvh] flex-col">
	<nav class="bg-gradient-to-l from-zinc-800/50 to-purple-950/50 text-white">
		<div class="container mx-auto flex flex-grow items-center justify-between px-4 py-2">
			<!-- Logo and Create Button -->
			<div class="flex items-center gap-2">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-0 rounded text-xl font-bold">
					<Logo class="mr-1 h-6 w-6" />
					<span class="hidden sm:block">Retro</span>
					<span class="sm:hidden">r</span>
					<span class="hidden text-purple-500 sm:block">Pad</span>
					<span class="text-purple-500 sm:hidden">p</span>
				</a>

				<!-- Create Pad Button - desktop only -->
				{#if page.data.session && page.data.user}
					<a
						href="/pads/create"
						class="hidden items-center rounded-md bg-purple-800 px-2 py-1 hover:bg-purple-700 sm:flex"
					>
						<AddIcon class="h-4 w-4" />
						<span class="ml-1 text-sm text-purple-50">Pad</span>
					</a>
				{/if}
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center gap-4 sm:flex">
				{#if page.data.session && page.data.user}
					<!-- Admin Button -->
					{#if page.data.user.isAdmin}
						<a
							href="/admin/dashboard"
							class="flex items-center gap-1 rounded border border-white/40 px-2 py-1 text-white/80 hover:bg-white/10"
						>
							<AdminButtonIcon class="h-4 w-4" /> Admin
						</a>
					{/if}

					<!-- User Profile Section -->
					<div class="flex items-center gap-2">
						<img
							src={page.data.user.avatarUrl}
							class="h-8 w-8 rounded-full"
							alt={page.data.user.name}
						/>
						<div class="flex flex-col">
							<span class="flex items-center gap-1 text-sm font-bold text-purple-50">
								{page.data.user.name}
								{#if page.data.user.isAdmin}
									<AdminIcon class="h-4 w-4" />
								{/if}
							</span>
							<form action="/logout" method="POST" class="w-full">
								<button type="submit" role="menuitem" class="text-xs text-white/80 hover:underline">
									Sign Out
								</button>
							</form>
						</div>
					</div>
				{/if}
			</div>

			<!-- Mobile Navigation -->
			{#if page.data.session && page.data.user}
				<div class="flex items-center gap-2 sm:hidden">
					<!-- Create Pad Button - Mobile -->
					<a
						href="/pads/create"
						class="flex items-center rounded-md bg-purple-800 px-2 py-1 hover:bg-purple-700"
						aria-label="Create new pad"
					>
						<AddIcon class="h-4 w-4" />
					</a>

					<!-- Mobile Menu Button -->
					<button
						onclick={toggleMobileMenu}
						class="flex items-center rounded-md p-1 hover:bg-white/10"
						aria-label="Toggle menu"
						aria-expanded={mobileMenuOpen}
					>
						<MenuIcon class="h-5 w-5" />
					</button>

					<!-- Mobile Avatar -->
					<img
						src={page.data.user.avatarUrl}
						class="h-8 w-8 rounded-full"
						alt={page.data.user.name}
					/>
				</div>

				<!-- Mobile Menu Dropdown -->
				{#if mobileMenuOpen}
					<div
						class="absolute top-[52px] right-0 z-50 w-48 rounded-b-md border-x border-b border-zinc-700 bg-zinc-900 shadow-lg"
					>
						<div class="p-2">
							<div class="border-b border-zinc-800 pb-2">
								<p class="flex items-center gap-1 font-bold text-purple-50">
									{page.data.user.name}
									{#if page.data.user.isAdmin}
										<AdminIcon class="h-4 w-4" />
									{/if}
								</p>
							</div>
							<div class="py-2">
								{#if page.data.user.isAdmin}
									<a
										href="/admin/dashboard"
										class="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-800"
									>
										<AdminButtonIcon class="h-4 w-4" />
										<span>Admin Dashboard</span>
									</a>
								{/if}
								<form action="/logout" method="POST" class="w-full">
									<button
										type="submit"
										class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-zinc-800"
									>
										Sign Out
									</button>
								</form>
							</div>
						</div>
					</div>

					<!-- Backdrop for closing menu when clicked outside -->
					<button
						class="fixed inset-0 z-40 bg-black/20"
						onclick={toggleMobileMenu}
						aria-label="Close mobile menu"
					></button>
				{/if}
			{/if}
		</div>
	</nav>

	<!-- Content area - use full width for pad views -->
	<div
		class={isPadView
			? 'flex-1 overflow-hidden'
			: 'container mx-auto flex flex-col gap-4 px-4 py-6 md:max-w-4xl'}
	>
		{@render children()}
	</div>

	<footer class="mt-auto bg-gradient-to-l from-zinc-800/50 to-purple-950/50 text-white">
		<div class="container mx-auto flex flex-col gap-4 px-4 py-2">
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center">
					© 2025 <Logo class="mr-1 ml-2 h-4 w-4" /> <span class="font-bold">Retro</span><span
						class="font-bold text-purple-500">Pad</span
					>
				</div>
				<div class="flex items-center gap-4 text-zinc-400">
					<a
						href="https://github.com/cr0wst/retro-pad"
						class="hover:text-purple-400"
						target="_blank"
						rel="noopener noreferrer">GitHub</a
					>
					<span>MIT License</span>
				</div>
			</div>
		</div>
	</footer>
</div>
