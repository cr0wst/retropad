import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import { padsTable, generateId } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

const schema = z.object({
	name: z
		.string()
		.min(1, { message: 'Please enter a name for your Pad' })
		.max(50, { message: 'Name must be 50 characters or less' })
		.trim(),
	description: z
		.string()
		.max(500, { message: 'Description must be 500 characters or less' })
		.optional()
		.transform((val) => (val === '' ? undefined : val))
});

export const load = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { form: null, error: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}

		const [pad] = await locals.db
			.insert(padsTable)
			.values({
				id: generateId(),
				ownerId: locals.user.id,
				name: form.data.name,
				description: form.data.description
			})
			.returning();

		// Return the form with a status message
		return redirect(302, `/pads/${pad.id}`);
	}
};
