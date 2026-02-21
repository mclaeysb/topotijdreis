<script lang="ts">
	import LayerInfo from './LayerInfo.svelte';

	import type { Layer } from '$lib/types/types';
	import Item from './ui/item/item.svelte';

	let {
		visibleLayers
	}: {
		visibleLayers: Layer[];
	} = $props();
</script>

<div class="absolute right-0 bottom-0">
	<Item>
		{#each visibleLayers as layer}
			<LayerInfo {layer}></LayerInfo>
		{/each}
	</Item>
</div>
