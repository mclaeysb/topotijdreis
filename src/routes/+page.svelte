<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import MapWithSlider from '$lib/components/MapWithSlider.svelte';

	import type { Camera, SortedLayer, Type } from '$lib/types/types';

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

	let compare = $state(false);

	// Shared camera state
	let camera = $state({ center: [0, 0], zoom: 4, bearing: 0, pitch: 0 });

	// Reference to whichever map is currently driving the sync
	let leaderId = $state<string | null>(null);

	function onCameraChange(id: string | null, newCamera: Camera) {
		leaderId = id;
		camera = newCamera;
	}
</script>

<svelte:head>
	<title>Topotijdreis.be</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<Header bind:selectedTypes bind:compare />
	<div
		class="flex min-h-0 flex-1
             flex-col overflow-hidden
             {compare ? 'portrait:flex-col landscape:flex-row' : ''}"
	>
		<!-- <div class="grid h-screen grid-cols-[4rem_1fr] grid-rows-[3rem_1fr]"> -->
		<MapWithSlider id="a" {allLayers} {selectedTypes} {camera} {leaderId} {onCameraChange}
		></MapWithSlider>
		{#if compare}
			<MapWithSlider id="b" {allLayers} {selectedTypes} {camera} {leaderId} {onCameraChange}
			></MapWithSlider>
		{/if}
	</div>
</div>
