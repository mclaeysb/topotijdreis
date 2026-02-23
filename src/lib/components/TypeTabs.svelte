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

<Tabs.Root bind:value={selectedType} class="">
	<Tabs.List class="border bg-accent-foreground p-1">
		<Tabs.Trigger
			value="topo"
			class="text-accent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
			><Map /></Tabs.Trigger
		>
		<Tabs.Trigger
			value="aerial"
			class="text-accent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
			><Camera /></Tabs.Trigger
		>
	</Tabs.List>
</Tabs.Root>
