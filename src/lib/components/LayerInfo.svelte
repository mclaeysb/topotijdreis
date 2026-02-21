<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';

	import type { Layer } from '$lib/types/types';
	import { Info } from '@lucide/svelte';
	import { Badge } from './ui/badge';
	import CopyButton from './ui/copy-button/copy-button.svelte';
	import Button from './ui/button/button.svelte';

	let {
		layer
	}: {
		layer: Layer;
	} = $props();
</script>

<Item.Root variant="outline" class="w-90 bg-white p-1 md:w-110  md:p-4">
	<Item.Content>
		<Item.Title class="p-1	 text-sm">
			{layer.description}
			<Badge class="h-full text-xs"
				><span class="font-mono"
					>{#if layer.yearStart}{layer.yearStart} →{/if}
					{layer.year}</span
				>
			</Badge>
			<div class="text-xs font-light md:hidden">
				<span class="mr-0.5">&copy;</span>
				{@html layer.attribution}
			</div>
		</Item.Title>
		<Item.Description class="hidden items-center text-xs md:flex">
			<Badge variant="outline" class=" mr-4 h-full w-18 text-xs select-none">{layer.coverage}</Badge
			>
			<div>
				<span class="mr-0.5 text-sm">&copy;</span>
				{@html layer.attribution}
			</div>
			<Button variant="link" class=" text-right text-xs text-primary"><Info></Info>About</Button>
			<CopyButton size="sm" class="text-right font-mono text-xs" text={layer.url}
				>{layer.urlType}</CopyButton
			>
		</Item.Description>
	</Item.Content>
</Item.Root>
