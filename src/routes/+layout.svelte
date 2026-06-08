<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Explore historical maps and imagery in Belgium" />
	<meta name="keywords" content="Belgium, map, historical, cartography" />
	<meta name="author" content="Manuel Claeys Bouuaert" />
</svelte:head>

<div>
	{@render children()}
</div>
