import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { authUserTable, authSessionTable } from './schema';

export function getDB(platform: { env: { DB: D1Database } }) {
	if (!platform.env.DB) {
		throw new Error('D1 database not available');
	}
	return drizzle(platform.env.DB);
}

// Export the table schemas but not the User and Session types
export { authUserTable, authSessionTable };
