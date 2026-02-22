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

	const selectedYears = $derived(selectedLayers.map((layer) => layer.year));
</script>

<div class="flex h-full w-full flex-col">
	<div class="z-20 flex justify-center py-2 md:bg-stone-800">
		<div class="-ml-0.5">
			<TypeTabs bind:selectedTypes />
		</div>
	</div>

	<div class="relative flex-1">
		<Slider.Root
			type="single"
			bind:value={selectedYear}
			min={earliestYear}
			max={latestYear}
			step={1}
			orientation="vertical"
			class="relative flex h-full w-full touch-none flex-col select-none"
			trackPadding={3}
		>
			{#snippet children({ tickItems })}
				<span
					class="absolute z-5 hidden h-full w-full cursor-pointer overflow-hidden border-r border-stone-900 bg-stone-800 transition md:flex"
				>
					<Slider.Range class="absolute w-full bg-stone-800" />
				</span>

				<Slider.Thumb
					index={0}
					class="border-grey-700 justify left-0 z-20 flex h-9	 w-24 cursor-pointer items-center rounded-r-sm border border-l-0 bg-white shadow-lg focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 "
				>
					<!-- hover:scale-110 -->
					<span class="ml-4 flex items-center text-xl font-bold text-stone-700">
						{selectedYear}
						<ChevronsUpDown class="ml-1" size={16} />
					</span>
				</Slider.Thumb>

				{#each tickItems as { index, value } (index)}
					{#if value % 5 === 0}
						<Slider.Tick
							{index}
							class="z-10 ml-2 hidden h-0.5 w-1 bg-stone-400 transition md:flex"
						/>
					{/if}
					{#if value % 25 === 0 || value === earliestYear}
						<Slider.TickLabel
							{index}
							position="right"
							class="z-5 -ml-11 hidden text-xs leading-none font-medium text-stone-200 transition md:flex"
						>
							{value}
						</Slider.TickLabel>
					{/if}
				{/each}
				{#each tickItems as { index, value } (index)}
					{#if selectedYears.includes(value)}
						<Slider.Tick
							{index}
							class="-left-0.5 z-10 ml-2 hidden h-2 w-2 rounded-2xl bg-stone-300 transition md:flex"
						/>
					{/if}
				{/each}
				<!-- {#each tickItems as { index, value } (index)}
				{#if selectedYears.includes(value)}
				<Slider.Tick {index} class="z-10 ml-2 h-1 w-1 rounded-2xl bg-stone-600" />
				{/if}
				{/each} -->
			{/snippet}
		</Slider.Root>
	</div>
</div>
