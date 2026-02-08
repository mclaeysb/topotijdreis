<script lang="ts">
	import { Slider } from 'bits-ui';
	import { ChevronsUpDown } from '@lucide/svelte';

	let selectedYear = $state(1925);
	let earliestYear = 1830;
	let latestYear = new Date().getFullYear();
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
			<span class="absolute h-full w-full cursor-pointer overflow-hidden bg-neutral-500">
				<Slider.Range class="absolute w-full bg-neutral-700" />
			</span>

			<!-- Thumb with label inside -->
			<Slider.Thumb
				index={0}
				class="border-grey-700 justify left-0 z-10 flex h-9	 w-21 cursor-pointer items-center rounded-r-sm border-1 border-l-0 bg-white shadow-lg hover:scale-110 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 "
			>
				<span class="ml-2 flex items-center text-xl font-bold text-neutral-800">
					{selectedYear}
					<ChevronsUpDown class="ml-1" size={16} />
				</span>
			</Slider.Thumb>

			<!-- Ticks and Tick Labels -->
			{#each tickItems as { index, value } (index)}
				{#if value % 5 === 0}
					<Slider.Tick {index} class="z-5 ml-2 h-0.5 w-1 bg-neutral-400" />
				{/if}
				{#if value % 25 === 0 || value === earliestYear}
					<Slider.TickLabel
						{index}
						position="right"
						class="-ml-11 text-xs leading-none font-medium text-neutral-200"
					>
						{value}
					</Slider.TickLabel>
				{/if}
			{/each}
		{/snippet}
	</Slider.Root>
</div>
