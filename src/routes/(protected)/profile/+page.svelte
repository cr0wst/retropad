<script lang="ts">
	import { page } from '$app/state';

	const { user } = page.data;
</script>

<h1>Profile</h1>
<p>Welcome {user?.name}</p>
