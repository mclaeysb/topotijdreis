<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import YearSlider from '$lib/components/Slider.svelte';
	import LayersInfo from '$lib/components/LayersInfo.svelte';

	import type { Camera, Layer, SortedLayer, Type } from '$lib/types/types';

	let selectedYear: number = $state(1971);
	let currentYear = new Date().getFullYear();

	let {
		allLayers,
		selectedTypes,
		id,
		camera,
		leaderId,
		onCameraChange
	}: {
		allLayers: SortedLayer[];
		selectedTypes: Type[];
		id: string | null;
		camera: Camera;
		leaderId: string | null;
		onCameraChange: (id: string | null, camera: Camera) => void;
	} = $props();

	let selectedLayers: Layer[] = $derived(
		allLayers
			.filter((layer) => selectedTypes.includes(layer.type))
			.sort((layer0, layer1) => {
				if (layer0.year != layer1.year) {
					return layer0.year - layer1.year;
				}
				if (layer0.transparent != layer1.transparent) {
					return Number(!layer1.transparent);
				}
				return 0;
			})
			.map((layer, _i, array) => {
				const years = Array.from(
					new Set(array.filter((l) => l.transparent !== true).map((l) => l.year))
				);
				const index = years.indexOf(layer.year);
				return {
					...layer,
					previousYear: index > 0 ? years[index - 1] : 0,
					nextYear: index < array.length - 1 ? years[index + 1] : 3000
				};
			})
	);

	let selectedYears = $derived(selectedLayers.map((layer) => layer.year).concat([currentYear]));
	let earliestYear = $derived(Math.min(...selectedYears));
	let latestYear = $derived(Math.max(...selectedYears));

	let visibleLayers: Layer[] = $derived(
		selectedLayers.filter(
			(layer) =>
				selectedYear >= layer.year && (layer.nextYear ? selectedYear < layer.nextYear : true)
		)
	);
	let visibleLayerNames: string[] = $derived(visibleLayers.map((layer) => layer.name));
</script>

<div class="relative flex min-h-0 min-w-0 flex-1 flex-row">
	<div class="absolute top-0 left-0 h-full w-20">
		<YearSlider bind:selectedYear {selectedLayers} {earliestYear} {latestYear} />
	</div>

	<div class="relative flex min-h-0 min-w-0 flex-1">
		<LayersInfo {visibleLayers} />
		<Map {allLayers} {visibleLayerNames} {id} {camera} {leaderId} {onCameraChange} />
	</div>
</div>

<!-- <div class="flex h-full w-full">
	<aside class="h-full w-0 shadow-md md:w-20">
		<YearSlider bind:selectedYear {selectedLayers} {earliestYear} {latestYear} />
	</aside>

	<main class="relative h-full w-full overflow-hidden">
		<LayersInfo {visibleLayers}></LayersInfo>
		<Map {allLayers} {visibleLayerNames} />
	</main>
</div> -->
