<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';

	let container: HTMLElement;
	let map: maplibregl.Map; // TODO: make readable?

	onMount(() => {
		map = new maplibregl.Map({
			container,
			// style: 'https://tiles.openfreemap.org/styles/liberty',
			style: {
				version: 8,
				sources: {
					'NGI Basemap 1873': {
						type: 'raster',
						tiles: [
							'https://wmts.ngi.be/arcgis/rest/services/seamless_carto__default__3857__140/MapServer/tile/{z}/{y}/{x}'
						],
						tileSize: 256
					}
				},
				layers: [
					{
						id: 'NGI Basemap 1873',
						type: 'raster',
						source: 'NGI Basemap 1873'
					}
				]
			},
			bounds: new maplibregl.LngLatBounds([
				[2.4917151948012304, 51.574107450095224],
				[6.441082276909043, 49.439402309291864]
			]),
			maxPitch: 0,
			bearingSnap: 0,
			attributionControl: false
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
</script>

<div class="h-full w-full" bind:this={container}></div>
