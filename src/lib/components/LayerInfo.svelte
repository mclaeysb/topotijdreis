<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';

	import type { Layer } from '$lib/types/types';
	import { Info } from '@lucide/svelte';
	import { Badge } from './ui/badge';
	import CopyButton from './ui/copy-button/copy-button.svelte';
	import Button from './ui/button/button.svelte';

	let { layer, compact = false }: { layer: Layer; compact?: boolean } = $props();
</script>

<Item.Content class="p-1 md:p-2">
	<Item.Title class="p-1 text-sm">
		{layer.description}
		<Badge class="h-full text-xs">
			<span class="font-mono"
				>{#if layer.yearStart}{layer.yearStart} →{/if}
				{layer.year}</span
			>
		</Badge>
		<div class="{compact ? 'lg:hidden' : 'md:hidden'} text-xs font-light">
			<span class="mr-0.5">&copy;</span>
			{@html layer.attribution}
		</div>
	</Item.Title>
	<Item.Description class="hidden items-center text-xs {compact ? 'lg:flex' : 'md:flex'}">
		<Badge variant="outline" class="mr-4 h-full w-18 text-xs select-none">{layer.coverage}</Badge>
		<div class="mr-2">
			<span class="mr-0.5 text-sm">&copy;</span>
			{@html layer.attribution}
		</div>
		<CopyButton size="sm" class=" text-right font-mono text-xs" text={layer.url}
			>{layer.urlType}</CopyButton
		>
		{#if layer.moreInfo}
			<Button variant="link" href={layer.moreInfo} class="mr-2 text-right text-xs text-primary"
				><Info />About</Button
			>
		{/if}
	</Item.Description>
</Item.Content>
