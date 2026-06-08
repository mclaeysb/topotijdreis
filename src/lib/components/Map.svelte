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
	let map: maplibregl.Map;
	let mapStyleLoaded = $state(false);
	let syncEnabled = $state(false);

	function getLocationGeoJSON(coords: [number, number]): GeoJSON.FeatureCollection {
		return {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: { type: 'Point', coordinates: coords },
					properties: {}
				}
			]
		};
	}

	function emptyGeoJSON(): GeoJSON.FeatureCollection {
		return { type: 'FeatureCollection', features: [] };
	}

	onMount(() => {
		map = new maplibregl.Map({
			container,
			style: {
				version: 8,
				sources: Object.fromEntries(
					allLayers.map((layer) => [
						layer.name,
						{ type: 'raster', tiles: [layer.url], tileSize: 256 }
					])
				),
				layers: allLayers.map((layer) => ({
					id: layer.name,
					type: 'raster',
					source: layer.name,
					tileSize: 256,
					layout: {
						visibility: visibleLayerNames.includes(layer.name) ? 'visible' : 'none'
					}
				}))
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

		map.setMinZoom(map.getZoom());
		map.dragRotate.disable();
		map.touchZoomRotate.disableRotation();

		map.on('style.load', () => {
			map.addSource('user-location-source', {
				type: 'geojson',
				data: emptyGeoJSON()
			});

			// White halo / outer ring
			map.addLayer({
				id: 'user-location-outer',
				type: 'circle',
				source: 'user-location-source',
				paint: {
					'circle-radius': 10,
					'circle-color': '#ffffff',
					'circle-opacity': 1,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#2979ff',
					'circle-stroke-opacity': 0.5
				}
			});

			// Blue filled inner dot
			map.addLayer({
				id: 'user-location-inner',
				type: 'circle',
				source: 'user-location-source',
				paint: {
					'circle-radius': 7,
					'circle-color': '#2979ff',
					'circle-opacity': 1,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#ffffff',
					'circle-stroke-opacity': 1
				}
			});

			mapStyleLoaded = true;
		});

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
		if (!mapStyleLoaded) return;

		const source = map.getSource('user-location-source') as maplibregl.GeoJSONSource | undefined;
		if (!source) return;

		if (userLocation) {
			source.setData(getLocationGeoJSON(userLocation));
			map.flyTo({ center: userLocation, zoom: 14 });
		} else {
			source.setData(emptyGeoJSON());
		}
	});
</script>

<div class="h-full w-full bg-white" bind:this={container}></div>
