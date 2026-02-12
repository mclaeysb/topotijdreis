<script lang="ts">
	import { Slider } from 'bits-ui';
	import { ChevronsUpDown } from '@lucide/svelte';
	import type { Layer } from '$lib/types/types';

	let {
		selectedYear = $bindable(),
		selectedLayers,
		earliestYear,
		latestYear
	}: {
		selectedYear: number;
		selectedLayers: Layer[];
		earliestYear: number;
		latestYear: number;
	} = $props();

	const selectedYears = $derived(selectedLayers.map((layer) => layer.year));
</script>

<div class="flex h-full w-full">
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
				class="absolute h-full w-full cursor-pointer overflow-hidden border-r border-amber-900 bg-amber-800"
			>
				<Slider.Range class="absolute w-full bg-amber-900" />
			</span>

			<Slider.Thumb
				index={0}
				class="border-grey-700 justify left-0 z-10 flex h-9	 w-21 cursor-pointer items-center rounded-r-sm border border-l-0 bg-white shadow-lg hover:scale-110 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 "
			>
				<span class="ml-2 flex items-center text-xl font-bold text-amber-700">
					{selectedYear}
					<ChevronsUpDown class="ml-1" size={16} />
				</span>
			</Slider.Thumb>

			{#each tickItems as { index, value } (index)}
				{#if value % 5 === 0}
					<Slider.Tick {index} class="z-5 ml-2 h-0.5 w-1 bg-amber-400" />
				{/if}
				{#if value % 25 === 0 || value === earliestYear}
					<Slider.TickLabel
						{index}
						position="right"
						class="-ml-11 text-xs leading-none font-medium text-amber-200"
					>
						{value}
					</Slider.TickLabel>
				{/if}
			{/each}
			{#each tickItems as { index, value } (index)}
				{#if selectedYears.includes(value)}
					<Slider.Tick {index} class="-left-0.5 z-5 ml-2 h-2 w-2 rounded-2xl bg-amber-300" />
				{/if}
			{/each}
			<!-- {#each tickItems as { index, value } (index)}
				{#if selectedYears.includes(value)}
					<Slider.Tick {index} class="z-5 ml-2 h-1 w-1 rounded-2xl bg-amber-600" />
				{/if}
			{/each} -->
		{/snippet}
	</Slider.Root>
</div>
