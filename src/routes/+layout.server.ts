export function load({ locals }: any) {
	return {
		user: locals.user,
		session: locals.session
	};
}
