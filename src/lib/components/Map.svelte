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
		onCameraChange,
		userLocation
	}: {
		allLayers: SortedLayer[];
		visibleLayerNames: string[];
		id: string | null;
		camera: Camera | null;
		leaderId: string | null;
		onCameraChange: (id: string | null, camera: Camera) => void;
		userLocation?: [number, number];
	} = $props();

	let container: HTMLElement;
	let map: maplibregl.Map; // TODO: make readable?
	let mapStyleLoaded = $state(false);
	let syncEnabled = $state(false); // ← key addition

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
			bearing: 0,
			bearingSnap: 0,
			attributionControl: false
		});

		map.dragRotate.disable();
		map.touchZoomRotate.disableRotation();

		map.on('style.load', () => {
			mapStyleLoaded = true;
		});

		// Only register move listener after the map is fully idle
		map.once('idle', () => {
			syncEnabled = true;

			map.on('move', () => {
				if (!map.isMoving()) return;
				onCameraChange(id, {
					center: map.getCenter().toArray(),
					zoom: map.getZoom(),
					bearing: map.getBearing(),
					pitch: map.getPitch()
				});
			});
		});

		onDestroy(() => {
			if (map) map.remove();
		});

		// Ensure correct sizing if layout changes or initial size wasn't computed yet
		requestAnimationFrame(() => map.resize());
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
		if (!syncEnabled || leaderId === id || camera == null) return;

		map.jumpTo({
			center: camera.center as [number, number],
			zoom: camera.zoom,
			bearing: camera.bearing,
			pitch: camera.pitch
		});
	});

	$effect(() => {
		if (!map || !userLocation) return;
		map.flyTo({ center: userLocation, zoom: 14 });
	});
</script>

<div class=" h-full w-full bg-white" bind:this={container}></div>
