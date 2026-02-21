<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import type { Type } from '$lib/types/types';
	import { Camera, Map } from '@lucide/svelte';

	let {
		selectedTypes = $bindable()
	}: {
		selectedTypes: Type[];
	} = $props();

	let selectedType: Type = $derived(selectedTypes[0]);

	$effect(() => {
		selectedTypes = [selectedType];
	});
</script>

<Tabs.Root bind:value={selectedType}>
	<Tabs.List>
		<Tabs.Trigger value="topo"
			><Map />
			<div class="hidden md:flex">Topo</div></Tabs.Trigger
		>
		<Tabs.Trigger value="aerial"
			><Camera />
			<div class="hidden md:flex">Aerial</div></Tabs.Trigger
		>
	</Tabs.List>
</Tabs.Root>
