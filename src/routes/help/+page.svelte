<script lang="ts">
	import CallOut from '$lib/components/CallOut.svelte';
	import { page } from '$app/stores';
</script>

<div class="mx-auto max-w-3xl py-8">
	<h1 class="mb-2 text-3xl font-bold">Help & Documentation</h1>
	<p class="mb-8 text-zinc-400">
		Learn how to use RetroPad and get the most out of your gaming notes.
	</p>

	<div class="flex flex-col gap-6">
		<section>
			<h2 class="mb-4 text-xl font-semibold">Getting Started</h2>
			<div class="flex flex-col gap-4">
				<CallOut
					title="What is a Pad?"
					content="A Pad is a collection of notes about a game. It can be used to store FAQs, walkthroughs, and your own gaming notes. Please note that RetroPad is designed for gaming content only - do not store any sensitive or private information such as passwords, personal data, or financial information."
				/>
				<CallOut
					title="Creating Your First Pad"
					content="Click the '+ Pad' button in the top navigation bar to create a new pad. Give it a name, optional description, and add some tags to help organize your gaming notes."
				/>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-xl font-semibold">Working with Notes</h2>
			<div class="flex flex-col gap-4">
				<CallOut
					title="Adding Notes"
					content="Each pad can contain multiple notes. Notes support basic text formatting and can be organized with tags. You can also import existing FAQs and walkthroughs."
				/>
				<CallOut
					title="Organizing Notes"
					content="Use tags to categorize your notes within a pad. You can also reorder notes by dragging them to your preferred position."
				/>
			</div>
		</section>

		<section>
			<h2 class="mb-4 text-xl font-semibold">Privacy & Security</h2>
			<div class="flex flex-col gap-4">
				<CallOut
					title="Content Guidelines"
					content="RetroPad is specifically designed for gaming-related content. This includes game guides, walkthroughs, cheat codes, and personal gaming notes. Do not store sensitive information like passwords or personal data."
				/>
				<CallOut
					title="Data Storage"
					content="Your notes are stored securely in Cloudflare's infrastructure with encryption at rest. Access is protected by your Google account login. While your data is secure, RetroPad is designed for gaming content - we recommend keeping sensitive personal information in appropriate tools designed for that purpose."
				/>
			</div>
		</section>
	</div>
</div>

{#if !$page.data.session}
	<div class="mx-auto mt-8 max-w-3xl rounded-lg bg-purple-900/20 p-6">
		<h2 class="mb-2 text-xl font-semibold">Ready to Get Started?</h2>
		<p class="mb-4 text-zinc-400">
			Sign in with your Google account to create your first pad and start organizing your gaming
			notes.
		</p>
		<a
			href="/login/google"
			class="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
		>
			Sign In to Begin
		</a>
	</div>
{/if}
