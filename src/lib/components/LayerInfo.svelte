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
	<Item.Title class="px-1 text-sm">
		{layer.description}
		<Badge variant="default" class="h-full rounded bg-muted text-xs text-muted-foreground">
			<span class="font-mono"
				>{#if layer.yearStart}{layer.yearStart} →{/if}
				{layer.year}</span
			>
		</Badge>
		<Badge variant="outline" class="h-full w-8 rounded text-xs select-none"
			>{layer.coverage == 'partial' ? '...' : layer.coverage.substring(0, 3)}</Badge
		>

		<div title={layer.urlType} class="hidden {compact ? '' : 'md:flex'}">
			<CopyButton size="sm" class="text-right font-mono text-xs" text={layer.url}></CopyButton>
		</div>

		{#if layer.moreInfo}
			<Button
				variant="link"
				href={layer.moreInfo}
				class="-mr-1 -ml-3 hidden text-right text-xs text-foreground {compact ? '' : 'md:flex'}"
				><Info /></Button
			>
		{/if}
		<div class="mr-2">
			<span class="mr-0.5 text-sm">&copy;</span>
			{@html layer.attribution}
		</div>
	</Item.Title>
</Item.Content>
