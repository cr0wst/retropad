// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database } from '@cloudflare/workers-types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import 'unplugin-icons/types/svelte';
import type { User, Session } from '$lib/types/schema';

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			db: DrizzleD1Database;
			user: User | null;
			session: Session | null;
		}
	}
	interface CloudflareEnv {
		AUTH_SECRET: string;
	}
}

export {};
