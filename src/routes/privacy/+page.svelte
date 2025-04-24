<script lang="ts">
	/// <reference types="@sveltejs/kit" />
	/// <reference types="svelte" />
	import { page } from '$app/stores';
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="mb-12">
		<h1
			class="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
		>
			Privacy Policy
		</h1>
		<p class="mt-2 text-sm text-zinc-400">
			We are committed to protecting your privacy and ensuring your information is secure.
		</p>
	</div>

	<div class="space-y-12">
		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">Information We Collect</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<div class="space-y-4 text-zinc-300">
					<p>We collect the following types of information:</p>
					<ul class="list-inside list-disc space-y-2">
						<li>
							<span class="font-semibold">Account Information:</span> When you sign in with Google, we
							receive your email address and display name.
						</li>
						<li>
							<span class="font-semibold">User Content:</span> The notes and content you create and store
							in RetroPad.
						</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">How We Use Your Information</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<div class="space-y-4 text-zinc-300">
					<p>Your information is used for:</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Maintaining and improving our service</li>
						<li>Identifying you when you sign in</li>
						<li>Storing and managing your notes</li>
						<li>Communicating important updates about RetroPad</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">Data Storage and Security</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<div class="space-y-4 text-zinc-300">
					<p>We take the security of your data seriously:</p>
					<ul class="list-inside list-disc space-y-2">
						<li>All data is encrypted at rest</li>
						<li>Access is strictly controlled and limited</li>
						<li>We use secure HTTPS connections</li>
						<li>Regular security audits are performed</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">Third-Party Services</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<div class="space-y-4 text-zinc-300">
					<p>We use the following third-party services:</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Google OAuth for authentication</li>
						<li>Cloudflare for hosting and security</li>
					</ul>
					<p>Each service has its own privacy policy and data handling practices.</p>
				</div>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">Your Rights</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<div class="space-y-4 text-zinc-300">
					<p>You have the right to:</p>
					<ul class="list-inside list-disc space-y-2">
						<li>Access your personal information</li>
						<li>Request deletion of your data</li>
						<li>Export your notes</li>
						<li>Opt-out of communications</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-2xl font-semibold text-purple-100">Contact Us</h2>
			<div class="rounded-lg bg-zinc-900/50 p-6">
				<p class="text-zinc-300">
					Questions about our privacy policy? Email us at{' '}
					<a
						href="mailto:hello@retropad.io"
						class="text-purple-400 hover:text-purple-300 hover:underline"
					>
						hello@retropad.io
					</a>.
				</p>
			</div>
		</section>
	</div>
</div>
