<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { Columns2, Info } from '@lucide/svelte';
	import LocateMe from './LocateMe.svelte';

	import type { Camera, Language } from '$lib/types/types';

	let {
		compare = $bindable(),
		userLocation = $bindable(),
		camera = $bindable(),
		leaderId = $bindable(),
		language = $bindable()
	}: {
		compare: boolean;
		userLocation?: [number, number];
		camera: Camera | null;
		leaderId: string | null;
		language: Language;
	} = $props();

	function toggleCompare() {
		compare = !compare;
		if (!compare) {
			leaderId = null;
			camera = null;
		}
	}
</script>

<header class="z-20 bg-white">
	<nav
		aria-label="Global"
		class="mx-auto flex items-center justify-between border-b border-stone-300 p-2 shadow-lg md:px-8"
	>
		<div class="flex flex-1 gap-0 md:gap-2">
			<Button
				variant="default"
				class="bg-stone-800"
				aria-label="Toggle compare mode"
				aria-pressed={compare}
				onclick={toggleCompare}
			>
				<Columns2 aria-hidden="true" />
				<span class="hidden md:inline">Compare</span>
			</Button>
			<LocateMe bind:userLocation />
		</div>
		<div class="relative">
			<div class="mr-4 text-xl font-medium text-stone-900 select-none">Topotijdreis.be</div>
		</div>
		<!-- <div class="hidden md:flex md:flex-1 md:justify-end"> -->
		<div class="flex flex-1 justify-end">
			<Button variant="ghost" class="ml-4"
				><Info />
				<div class="hidden md:flex">About</div></Button
			>
		</div>
	</nav>
</header>
