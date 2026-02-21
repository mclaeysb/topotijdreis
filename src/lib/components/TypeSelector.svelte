<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	import type { Type } from '$lib/types/types';

	let {
		selectedTypes = $bindable()
	}: {
		selectedTypes: Type[];
	} = $props();

	const typeItems: { value: string; label: string; types: Type[] }[] = [
		{ value: 'topo', label: 'Topo', types: ['topo'] },
		{ value: 'aerial', label: 'Aerial', types: ['aerial'] },
		{ value: 'all', label: 'All', types: ['topo', 'aerial'] }
	];

	let value = $state('');

	const selectedLabel = $derived(
		typeItems.find((f) => f.value === value)?.label ??
			typeItems.find((f) => String(f.types) === String(selectedTypes))?.label ??
			'Select a type'
	);

	$effect(() => {
		selectedTypes = typeItems.find((f) => f.value === value)?.types ?? ['topo'];
	});
</script>

<div class="flex h-full w-full">
	<Select.Root type="single" name="selectedTypes" bind:value>
		<Select.Trigger class="w-25 border-stone-200 bg-stone-100 ">
			{selectedLabel}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each typeItems as type (type.value)}
					<Select.Item value={type.value} label={type.label}>
						{type.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
