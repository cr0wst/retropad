import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({ compiler: 'svelte', autoInstall: true }),
		svelteTesting()
	],
	// @ts-expect-error: Vitest test property is not in Vite types, but works at runtime
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest-setup.js']
	}
});
