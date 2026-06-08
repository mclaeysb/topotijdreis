<script lang="ts">
	import { Slider } from 'bits-ui';
	import { ChevronsUpDown } from '@lucide/svelte';
	import TypeTabs from './TypeTabs.svelte';

	import type { Layer, Type } from '$lib/types/types';

	let {
		selectedTypes = $bindable(),
		selectedYear = $bindable(),
		selectedLayers,
		earliestYear,
		latestYear
	}: {
		selectedTypes: Type[];
		selectedYear: number;
		selectedLayers: Layer[];
		earliestYear: number;
		latestYear: number;
	} = $props();

	let selectedYears = $derived(selectedLayers.map((layer) => layer.year));
	// svelte-ignore state_referenced_locally
	let invertedYear = $state(earliestYear + latestYear - selectedYear);

	function invertedYearToSelectedYear(invertedYear: number) {
		return earliestYear + latestYear - invertedYear;
	}

	$effect(() => {
		selectedYear = invertedYearToSelectedYear(invertedYear);
	});
</script>

<div class="flex h-full w-full flex-col">
	<div class="z-20 flex justify-center py-2 md:border-r md:bg-sidebar">
		<div class="-ml-0.5">
			<TypeTabs bind:selectedTypes />
		</div>
	</div>

	<div class="relative flex-1">
		<Slider.Root
			type="single"
			bind:value={invertedYear}
			min={earliestYear}
			max={latestYear}
			step={1}
			orientation="vertical"
			class="relative flex h-full w-full touch-none flex-col select-none"
			trackPadding={3}
		>
			{#snippet children({ tickItems })}
				<span
					class="absolute z-5 hidden h-full w-full cursor-pointer overflow-hidden border-r-1 bg-sidebar transition md:flex"
				>
					<Slider.Range class="absolute w-full " />
				</span>

				<Slider.Thumb
					index={0}
					class="border-grey-700 justify left-0 z-20 flex h-9 w-24 cursor-pointer items-center rounded-r-sm border border-l-0 bg-primary shadow-md focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				>
					<span class="ml-4 flex items-center text-xl font-bold text-sidebar">
						{selectedYear}
						<ChevronsUpDown class="ml-1" size={16} />
					</span>
				</Slider.Thumb>

				{#each tickItems as { index, value } (index)}
					{#if invertedYearToSelectedYear(value) % 5 === 0}
						<Slider.Tick
							{index}
							class="z-10 ml-2 hidden h-0.5 w-1 bg-muted-foreground transition md:flex"
						/>
					{/if}
					{#if invertedYearToSelectedYear(value) % 25 === 0 || value === latestYear}
						<Slider.TickLabel
							{index}
							position="right"
							class="z-5 -ml-14 hidden text-xs leading-none font-medium text-sidebar-foreground transition md:flex"
						>
							{invertedYearToSelectedYear(value)}
						</Slider.TickLabel>
					{/if}
				{/each}

				{#each tickItems as { index, value } (index)}
					{#if selectedYears.includes(invertedYearToSelectedYear(value))}
						<!-- <Slider.Tick
							{index}
							class="-left-0.5 z-10 ml-2 hidden h-2 w-2 rounded-2xl bg-primary/30 transition md:flex"
						/> -->
						<Slider.Tick
							{index}
							class="-left-2 z-10 ml-2 hidden h-1 w-22 bg-muted-foreground/10 transition md:flex"
						/>
					{/if}
				{/each}
			{/snippet}
		</Slider.Root>
	</div>
</div>
