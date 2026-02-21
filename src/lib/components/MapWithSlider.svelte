<script lang="ts">
	import LayerInfo from '$lib/components/LayerInfo.svelte';
	import Map from '$lib/components/Map.svelte';
	import YearSlider from '$lib/components/Slider.svelte';

	import type { Layer, SortedLayer, Type } from '$lib/types/types';
	import LayersInfo from './LayersInfo.svelte';

	let selectedYear: number = $state(1971);
	let currentYear = new Date().getFullYear();

	let {
		allLayers,
		selectedTypes
	}: {
		allLayers: SortedLayer[];
		selectedTypes: Type[];
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

<div class="flex h-full w-full">
	<aside class="h-full w-0 shadow-md md:w-20">
		<YearSlider bind:selectedYear {selectedLayers} {earliestYear} {latestYear} />
	</aside>

	<main class="relative h-full w-full overflow-hidden">
		<LayersInfo {visibleLayers}></LayersInfo>
		<Map {allLayers} {visibleLayerNames} />
	</main>
</div>
