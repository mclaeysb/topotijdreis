<script lang="ts">
	import { PersistedState } from 'runed';
	import Header from '$lib/components/Header.svelte';
	import MapWithSlider from '$lib/components/MapWithSlider.svelte';
	import { MapUrlState } from '$lib/map-state.svelte';
	import type { Camera, Language, SortedLayer } from '$lib/types/types';

	let { data } = $props();

	const mapState = new MapUrlState();

	const currentYear = new Date().getFullYear();

	const allLayers: SortedLayer[] = $derived(
		data.layers
			.filter((layer) => layer.include !== false)
			.map((layer) => ({ ...layer, year: layer.year ?? currentYear }))
	);

	const language = new PersistedState<Language>('language', 'en');

	let leaderId = $state<string | null>(null);
	let userLocation = $state<[number, number] | undefined>(undefined);

	function onCameraChange(id: string | null, newCamera: Camera) {
		leaderId = id;
		mapState.camera = newCamera;
	}
</script>

<svelte:head>
	<title>Topotijdreis.be</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<Header
		bind:userLocation
		bind:compare={mapState.compare}
		bind:camera={mapState.camera}
		bind:leaderId
		language={language.current}
		text={data.text}
	/>
	<div
		class="flex min-h-0 flex-1 flex-col overflow-hidden bg-border
           {mapState.compare
			? 'portrait:flex-col portrait:gap-y-0.5 landscape:flex-row landscape:gap-x-px'
			: ''}"
	>
		<MapWithSlider
			id="a"
			{allLayers}
			camera={mapState.camera}
			{leaderId}
			{userLocation}
			{onCameraChange}
			compact={mapState.compare}
			bind:selectedYear={mapState.year}
			bind:selectedTypes={mapState.selectedTypes}
		/>
		{#if mapState.compare}
			<MapWithSlider
				id="b"
				{allLayers}
				camera={mapState.camera}
				{leaderId}
				{userLocation}
				{onCameraChange}
				compact={mapState.compare}
				bind:selectedYear={mapState.year2}
				bind:selectedTypes={mapState.selectedTypes2}
			/>
		{/if}
	</div>
</div>
