<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { mapContext } from '$lib/map-context';

	let { children } = $props();

	const map = $state({ year: 3000 });
	mapContext.set(map);

	const era = $derived(map.year >= 1873 && map.year < 1904 ? '1873' : undefined);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link href="https://fonts.googleapis.com/css2?family=Antic+Slab&display=swap" rel="stylesheet" />
</svelte:head>

<div data-era={era}>
	{@render children()}
</div>
