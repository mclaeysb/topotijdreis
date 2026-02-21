<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';

	import type { SortedLayer } from '$lib/types/types';

	let { allLayers, visibleLayerNames }: { allLayers: SortedLayer[]; visibleLayerNames: string[] } =
		$props();

	let container: HTMLElement;
	let map: maplibregl.Map; // TODO: make readable?
	let mapStyleLoaded = $state(false);

	onMount(() => {
		map = new maplibregl.Map({
			container,
			// style: 'https://tiles.openfreemap.org/styles/liberty',
			style: {
				version: 8,
				sources: Object.fromEntries(
					allLayers.map((layer) => [
						layer.name,
						{ type: 'raster', tiles: [layer.url], tileSize: 256 }
					])
				),
				layers: allLayers.map((layer) => {
					return {
						id: layer.name,
						type: 'raster',
						source: layer.name,
						tileSize: 256,
						layout: {
							visibility: visibleLayerNames.includes(layer.name) ? 'visible' : 'none'
						}
					};
				})
			},
			bounds: new maplibregl.LngLatBounds([
				[2.4917151948012304, 51.574107450095224],
				[6.441082276909043, 49.439402309291864]
			]),
			maxPitch: 0,
			bearingSnap: 0,
			attributionControl: false
		});

		map.on('style.load', () => {
			mapStyleLoaded = true;
		});

		// map.addControl(new maplibregl.NavigationControl(), 'top-right');
		// map.addControl(
		// 	new maplibregl.GeolocateControl({
		// 		positionOptions: {
		// 			enableHighAccuracy: true
		// 		},
		// 		trackUserLocation: true
		// 	}),
		// 	'top-left'
		// );

		// Ensure correct sizing if layout changes or initial size wasn't computed yet
		requestAnimationFrame(() => map.resize());
	});

	onDestroy(() => {
		if (map) map.remove();
	});

	$effect(() => {
		if (mapStyleLoaded) {
			for (const layer of allLayers) {
				map.setLayoutProperty(
					layer.name,
					'visibility',
					visibleLayerNames.includes(layer.name) ? 'visible' : 'none'
				);
			}
		}
	});
</script>

<div class=" h-full w-full" bind:this={container}></div>
