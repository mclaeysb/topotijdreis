<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	import YearSlider from '$lib/components/YearSlider.svelte';

	import type { Layer, Type } from '$lib/types/types';

	let { data } = $props();

	let selectedYear: number = $state(1925);
	let currentYear = new Date().getFullYear();

	let selectedTypes: Type[] = $state(['aerial']);

	let selectedLayers: Layer[] = $derived(
		data.layers
			.filter((layer) => layer.include !== false)
			.filter((layer) => selectedTypes.includes(layer.type))
			.map((layer) => {
				return {
					...layer,
					year: layer.year ?? currentYear
				};
			})
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
	$inspect(selectedLayers);

	let selectedYears = $derived(selectedLayers.map((layer) => layer.year).concat([currentYear]));
	$inspect(selectedYears);
	let earliestYear = $derived(Math.min(...selectedYears));
	let latestYear = $derived(Math.max(...selectedYears));
</script>

<div class="grid h-screen grid-cols-[4rem_1fr] grid-rows-[3rem_1fr]">
	<header class="shad z-20 col-span-2 h-full w-full shadow-xl">
		<Header />
	</header>

	<aside class="z-15 shadow-md">
		<YearSlider bind:selectedYear {selectedLayers} {earliestYear} {latestYear} />
	</aside>

	<main class="h-full w-full overflow-hidden">
		<Map {selectedYear} {selectedLayers} />
	</main>
</div>
