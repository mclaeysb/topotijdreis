<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import MapWithSlider from '$lib/components/MapWithSlider.svelte';

	import type { SortedLayer, Type } from '$lib/types/types';

	let { data } = $props();

	let currentYear = new Date().getFullYear();

	let selectedTypes: Type[] = $state(['topo']);

	let allLayers: SortedLayer[] = $derived(
		data.layers
			.filter((layer) => layer.include !== false)
			.map((layer) => {
				return {
					...layer,
					year: layer.year ?? currentYear
				};
			})
	);
</script>

<svelte:head>
	<title>Topotijdreis.be</title>
</svelte:head>

<div class="h-full w-full">
	<Header bind:selectedTypes />
	<div class="h-150 w-full">
		<!-- <div class="grid h-screen grid-cols-[4rem_1fr] grid-rows-[3rem_1fr]"> -->
		<MapWithSlider {allLayers} {selectedTypes}></MapWithSlider>
		<!-- <MapWithSlider {allLayers} {selectedTypes}></MapWithSlider> -->
	</div>
</div>
