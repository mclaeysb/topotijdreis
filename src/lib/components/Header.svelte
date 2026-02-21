<script lang="ts">
	import TypeTabs from './TypeTabs.svelte';
	import Button from './ui/button/button.svelte';
	import { Columns2, Info, LocateFixed } from '@lucide/svelte';

	import type { Type } from '$lib/types/types';

	let {
		selectedTypes = $bindable(),
		compare = $bindable()
	}: {
		selectedTypes: Type[];
		compare: boolean;
	} = $props();
</script>

<header class="z-20 bg-white">
	<nav
		aria-label="Global"
		class="mx-auto flex items-center justify-between border-b border-stone-300 p-2 shadow-lg md:px-8"
	>
		<div class="flex flex-1">
			<!-- <Input placeholder="Go to location" class="mr-2 w-60"></Input> -->
			<Button variant="default" class="bg-stone-800"
				><Columns2 />
				<div
					class="hidden md:flex"
					onclick={() => {
						compare = !compare;
					}}
				>
					Compare
				</div></Button
			>
			<Button variant="outline" class="ml-2"
				><LocateFixed />
				<div class="hidden md:flex">Locate me</div></Button
			>
		</div>
		<div class="relative">
			<div class="mr-4 text-xl font-medium text-stone-900 select-none">Topotijdreis.be 🇧🇪</div>
		</div>
		<!-- <div class="hidden md:flex md:flex-1 md:justify-end"> -->
		<div class="flex flex-1 justify-end">
			<TypeTabs bind:selectedTypes />
			<Button variant="ghost" class="ml-4"
				><Info />
				<div class="hidden md:flex">About</div></Button
			>
		</div>
	</nav>
</header>
