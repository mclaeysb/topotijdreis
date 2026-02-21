<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';

	import type { Camera, SortedLayer } from '$lib/types/types';

	let {
		allLayers,
		visibleLayerNames,
		id,
		camera = null,
		leaderId,
		onCameraChange
	}: {
		allLayers: SortedLayer[];
		visibleLayerNames: string[];
		id: string | null;
		camera: Camera | null;
		leaderId: string | null;
		onCameraChange: (id: string | null, camera: Camera) => void;
	} = $props();

	let container: HTMLElement;
	let map: maplibregl.Map; // TODO: make readable?
	let mapStyleLoaded = $state(false);
	let initialized = $state(false);

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

		map.on('move', () => {
			if (!map.isMoving()) return;
			onCameraChange(id, {
				center: map.getCenter().toArray(),
				zoom: map.getZoom(),
				bearing: map.getBearing(),
				pitch: map.getPitch()
			});
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

		initialized = true;
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

	$effect(() => {
		if (!map || leaderId === id || camera == null || !initialized) return;

		console.log(camera);

		// map.jumpTo({
		// 	center: camera.center as [number, number],
		// 	zoom: camera.zoom,
		// 	bearing: camera.bearing,
		// 	pitch: camera.pitch
		// });
	});
</script>

<div class=" h-full w-full" bind:this={container}></div>
