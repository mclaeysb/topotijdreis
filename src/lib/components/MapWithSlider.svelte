<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import YearSlider from '$lib/components/Slider.svelte';
	import LayerInfo from '$lib/components/LayerInfo.svelte';
	import * as Item from '$lib/components/ui/item/index.js';

	import type { Camera, Layer, SortedLayer, Type } from '$lib/types/types';

	let currentYear = new Date().getFullYear();

	const layerCoverageOrder = ['belgium', 'flanders', 'wallonia', 'partial'];

	let {
		allLayers,
		id,
		camera,
		leaderId,
		onCameraChange,
		userLocation,
		compact = false,
		selectedTypes = $bindable(),
		selectedYear = $bindable()
	}: {
		allLayers: SortedLayer[];
		id: string | null;
		camera: Camera | null;
		leaderId: string | null;
		onCameraChange: (id: string | null, camera: Camera) => void;
		userLocation?: [number, number];
		compact: boolean;
		selectedTypes: Type[];
		selectedYear: number;
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
				const nextYearBelgium =
					array
						.filter((l) => l.coverage == 'belgium')
						.map((l) => l.year)
						.filter((y) => y > layer.year)[0] ?? 3000;
				const nextYearFlanders =
					array
						.filter((l) => l.coverage == 'flanders')
						.map((l) => l.year)
						.filter((y) => y > layer.year)[0] ?? 3001;
				const nextYearWallonia =
					array
						.filter((l) => l.coverage == 'wallonia')
						.map((l) => l.year)
						.filter((y) => y > layer.year)[0] ?? 3001;
				return {
					...layer,
					nextYearBelgium,
					nextYearFlanders,
					nextYearWallonia,
					nextYear:
						layer.coverage == 'belgium'
							? Math.min(nextYearBelgium, Math.max(nextYearFlanders, nextYearWallonia))
							: layer.coverage == 'flanders'
								? Math.min(nextYearBelgium, nextYearFlanders)
								: layer.coverage === 'wallonia'
									? Math.min(nextYearBelgium, nextYearWallonia)
									: Math.min(nextYearBelgium, nextYearFlanders, nextYearWallonia)
				};
			})
	);

	$inspect(selectedLayers);

	let selectedYears = $derived(selectedLayers.map((layer) => layer.year).concat([currentYear]));
	let earliestYear = $derived(Math.min(...selectedYears));
	let latestYear = $derived(Math.max(...selectedYears));

	let visibleLayers: Layer[] = $derived(
		selectedLayers
			.filter(
				(layer) =>
					selectedYear >= layer.year && (layer.nextYear ? selectedYear < layer.nextYear : true)
			)
			.sort(
				(layer0, layer1) =>
					layerCoverageOrder.indexOf(layer0.coverage) - layerCoverageOrder.indexOf(layer1.coverage)
			)
	);
	let visibleLayerNames: string[] = $derived(visibleLayers.map((layer) => layer.name));
</script>

<div class="relative flex min-h-0 min-w-0 flex-1 flex-row">
	<div class="absolute top-0 left-0 h-full w-22">
		<YearSlider bind:selectedTypes bind:selectedYear {selectedLayers} {earliestYear} {latestYear} />
	</div>

	<div class="relative flex min-h-0 min-w-0 flex-1">
		<Map {allLayers} {visibleLayerNames} {id} {camera} {leaderId} {userLocation} {onCameraChange} />
		<div class="absolute right-0 bottom-0 z-10 flex flex-col items-end">
			{#if visibleLayers.length > 0}
				<Item.Root
					variant="outline"
					class="mr-2 mb-2 flex-col items-stretch! gap-0 bg-card p-0 md:mr-4 md:mb-4 {compact
						? 'md:w-100'
						: 'md:w-140'}"
				>
					<div class="scrollbar-thin max-h-[130px] overflow-y-auto">
						{#each visibleLayers as layer, i}
							{#if i > 0}
								<hr class="" />
							{/if}
							<LayerInfo {layer} {compact} />
						{/each}
					</div>
				</Item.Root>
			{/if}
		</div>
	</div>
</div>
