import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { authUserTable } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { db, user } = locals;

	if (!user?.isAdmin) {
		throw error(403, 'Not authorized');
	}

	const managedUser = await db
		.select()
		.from(authUserTable)
		.where(eq(authUserTable.id, params.id))
		.get();

	if (!managedUser) {
		throw error(404, 'User not found');
	}

	return {
		managedUser
	};
};

export const actions: Actions = {
	banUser: async ({ locals, params, request }) => {
		const { db, user } = locals;

		if (!user?.isAdmin) {
			throw error(403, 'Not authorized');
		}

		const data = await request.formData();
		const duration = parseInt(data.get('duration')?.toString() || '7');
		const reason = data.get('reason')?.toString();

		const bannedUntil = new Date();
		bannedUntil.setDate(bannedUntil.getDate() + duration);

		await db
			.update(authUserTable)
			.set({
				isBanned: true,
				bannedUntil,
				banReason: reason || null,
				updatedAt: new Date()
			})
			.where(eq(authUserTable.id, params.id));

		// Fetch and return updated user data
		const updatedUser = await db
			.select()
			.from(authUserTable)
			.where(eq(authUserTable.id, params.id))
			.get();

		return { success: true, user: updatedUser };
	},

	unbanUser: async ({ locals, params }) => {
		const { db, user } = locals;

		if (!user?.isAdmin) {
			throw error(403, 'Not authorized');
		}

		await db
			.update(authUserTable)
			.set({
				isBanned: false,
				bannedUntil: null,
				banReason: null,
				updatedAt: new Date()
			})
			.where(eq(authUserTable.id, params.id));

		// Fetch and return updated user data
		const updatedUser = await db
			.select()
			.from(authUserTable)
			.where(eq(authUserTable.id, params.id))
			.get();

		return { success: true, user: updatedUser };
	},

	promoteUser: async ({ locals, params }) => {
		const { db, user } = locals;

		if (!user?.isAdmin) {
			throw error(403, 'Not authorized');
		}

		await db
			.update(authUserTable)
			.set({
				isAdmin: true,
				updatedAt: new Date()
			})
			.where(eq(authUserTable.id, params.id));

		// Fetch and return updated user data
		const updatedUser = await db
			.select()
			.from(authUserTable)
			.where(eq(authUserTable.id, params.id))
			.get();

		return { success: true, user: updatedUser };
	},

	demoteUser: async ({ locals, params }) => {
		const { db, user } = locals;

		if (!user?.isAdmin) {
			throw error(403, 'Not authorized');
		}

		await db
			.update(authUserTable)
			.set({
				isAdmin: false,
				updatedAt: new Date()
			})
			.where(eq(authUserTable.id, params.id));

		// Fetch and return updated user data
		const updatedUser = await db
			.select()
			.from(authUserTable)
			.where(eq(authUserTable.id, params.id))
			.get();

		return { success: true, user: updatedUser };
	},

	deleteUser: async ({ locals, params }) => {
		const { db, user } = locals;

		if (!user?.isAdmin) {
			throw error(403, 'Not authorized');
		}

		// Delete the user
		await db.delete(authUserTable).where(eq(authUserTable.id, params.id));

		// Redirect to the users list
		return {
			success: true,
			redirect: '/admin/users'
		};
	}
};
