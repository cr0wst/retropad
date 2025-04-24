<script lang="ts">
	import '../app.css';
	import AddIcon from '~icons/mdi/plus';
	import AdminButtonIcon from '~icons/mdi/cog-outline';
	import AdminIcon from '~icons/mdi/shield-check';
	import Logo from '~icons/mdi/gamepad-round-left';
	import MenuIcon from '~icons/mdi/menu';
	import GamepadIcon from '~icons/mdi/gamepad';
	import { page } from '$app/stores';
	import type { MouseEventHandler, KeyboardEventHandler } from 'svelte/elements';
	let { children } = $props();

	// Check if we're on a pad view page
	const isPadView = $derived($page.route.id?.startsWith('/(protected)/pads/[id]') || false);

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Get current path for active state
	const currentPath = $derived($page.url.pathname);

	// Navigation structure
	const navItems = [
		{
			label: 'Your Pads',
			href: '/pads',
			icon: GamepadIcon,
			adminOnly: false,
			// Match both /pads and any routes under /pads/
			isActive: (path: string) => path.startsWith('/pads')
		},
		{
			label: 'Admin Dashboard',
			href: '/admin/dashboard',
			icon: AdminButtonIcon,
			adminOnly: true,
			// Match both /admin and any routes under /admin/
			isActive: (path: string) => path.startsWith('/admin')
		}
	];

	// Helper to get active state classes
	function getActiveClasses(isActive: boolean, isMobile = false) {
		if (!isActive) return '';
		return isMobile ? 'bg-purple-500/20 text-purple-100' : 'bg-purple-800/50 text-purple-100';
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
		<div class="flex flex-grow items-center justify-between px-4 py-2">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-0 rounded text-xl font-bold">
				<Logo class="mr-1 h-6 w-6" />
				<span class="hidden sm:block">Retro</span>
				<span class="sm:hidden">r</span>
				<span class="hidden text-purple-500 sm:block">Pad</span>
				<span class="text-purple-500 sm:hidden">p</span>
			</a>

			<!-- Desktop Navigation -->
			{#if $page.data.session && $page.data.user}
				<div class="hidden items-center gap-4 sm:flex">
					<!-- Navigation Links -->
					{#each navItems as item}
						{#if !item.adminOnly || (item.adminOnly && $page.data.user.isAdmin)}
							<a
								href={item.href}
								class="flex items-center gap-1 rounded px-3 py-1 text-white transition-colors hover:bg-purple-800/50 {getActiveClasses(
									item.isActive(currentPath)
								)}"
								aria-current={item.isActive(currentPath) ? 'page' : undefined}
							>
								<svelte:component this={item.icon} class="h-4 w-4" />
								{item.label}
							</a>
						{/if}
					{/each}

					<!-- User Profile Section -->
					<div class="flex items-center gap-2">
						<img
							src={$page.data.user.avatarUrl}
							class="h-8 w-8 rounded-full"
							alt={$page.data.user.name}
						/>
						<div class="flex flex-col">
							<span class="flex items-center gap-1 text-sm font-bold text-purple-50">
								{$page.data.user.name}
								{#if $page.data.user.isAdmin}
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
				</div>

				<!-- Mobile Navigation -->
				<div class="flex items-center gap-2 sm:hidden">
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
						src={$page.data.user.avatarUrl}
						class="h-8 w-8 rounded-full"
						alt={$page.data.user.name}
					/>
				</div>

				<!-- Mobile Menu Dropdown -->
				{#if mobileMenuOpen}
					<div
						class="absolute top-[52px] right-0 z-50 w-64 rounded-b-lg border-x border-b border-zinc-700/50 bg-zinc-900/95 shadow-xl backdrop-blur-sm"
					>
						<!-- User Info -->
						<div class="border-b border-zinc-800 p-4">
							<div class="flex items-center gap-3">
								<img
									src={$page.data.user.avatarUrl}
									class="h-10 w-10 rounded-full"
									alt={$page.data.user.name}
								/>
								<div>
									<p class="flex items-center gap-1 font-bold text-purple-50">
										{$page.data.user.name}
										{#if $page.data.user.isAdmin}
											<AdminIcon class="h-4 w-4" />
										{/if}
									</p>
									<p class="text-sm text-zinc-400">Signed in with Google</p>
								</div>
							</div>
						</div>

						<!-- Navigation Links -->
						<div class="p-2">
							{#each navItems as item}
								{#if !item.adminOnly || (item.adminOnly && $page.data.user.isAdmin)}
									<a
										href={item.href}
										onclick={() => (mobileMenuOpen = false)}
										class="flex items-center gap-3 rounded-md px-3 py-2 text-white transition-colors hover:bg-purple-500/20 {getActiveClasses(
											item.isActive(currentPath),
											true
										)}"
										aria-current={item.isActive(currentPath) ? 'page' : undefined}
									>
										<svelte:component this={item.icon} class="h-5 w-5 text-purple-300" />
										<span>{item.label}</span>
									</a>
								{/if}
							{/each}

							<!-- Sign Out -->
							<div class="mt-2 border-t border-zinc-800 pt-2">
								<form action="/logout" method="POST" class="w-full">
									<button
										type="submit"
										onclick={((e) =>
											(mobileMenuOpen = false)) satisfies MouseEventHandler<HTMLButtonElement>}
										onkeydown={((e) =>
											e.key === 'Enter' &&
											(mobileMenuOpen = false)) satisfies KeyboardEventHandler<HTMLButtonElement>}
										class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-red-400 transition-colors hover:bg-red-500/10"
									>
										Sign Out
									</button>
								</form>
							</div>
						</div>
					</div>

					<!-- Backdrop -->
					<button
						onclick={toggleMobileMenu}
						class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
						aria-label="Close mobile menu"
					></button>
				{/if}
			{/if}
		</div>
	</nav>

	<!-- Content area -->
	<div
		class={isPadView
			? 'flex-1 overflow-hidden'
			: 'container mx-auto flex flex-col gap-4 px-0 py-6 sm:px-4 md:max-w-7xl'}
	>
		{@render children()}
	</div>

	<!-- Footer -->
	<footer class="mt-auto bg-gradient-to-l from-zinc-800/50 to-purple-950/50 text-white">
		<div class="flex flex-col gap-4 px-4 py-2">
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center">
					© 2025 <Logo class="mr-1 ml-2 h-4 w-4" /> <span class="font-bold">Retro</span><span
						class="font-bold text-purple-500">Pad</span
					>
				</div>
				<div class="flex items-center gap-4 text-zinc-400">
					<a href="/help" class="hover:text-purple-400">Help</a>
					<a href="/privacy" class="hover:text-purple-400">Privacy</a>
					<a href="/license" class="hover:text-purple-400">License</a>
				</div>
			</div>
		</div>
	</footer>
</div>
