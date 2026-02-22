<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { PersistedState, Debounced } from 'runed';

	import Header from '$lib/components/Header.svelte';
	import MapWithSlider from '$lib/components/MapWithSlider.svelte';
	import type { Camera, Language, SortedLayer, Type } from '$lib/types/types';

	let { data } = $props();

	const currentYear = new Date().getFullYear();

	const allLayers: SortedLayer[] = $derived(
		data.layers
			.filter((layer) => layer.include !== false)
			.map((layer) => ({ ...layer, year: layer.year ?? currentYear }))
	);

	// ── Defaults ────────────────────────────────────────────────────────────────
	const DEFAULT_TYPES: Type[] = ['topo'];
	const DEFAULT_YEAR: number = 1971;

	function parseTypes(raw: string | null): Type[] {
		if (!raw) return DEFAULT_TYPES;
		return raw.split(',') as Type[];
	}

	function getParams() {
		return $page.url.searchParams;
	}

	// ── URL-backed state (shareable) ────────────────────────────────────────────
	let yearA = $state(Number(getParams().get('a')) || DEFAULT_YEAR);
	let yearB = $state(Number(getParams().get('b')) || DEFAULT_YEAR);
	let compare = $state(getParams().get('compare') === 'true');
	let selectedTypesA = $state<Type[]>(parseTypes(getParams().get('typesA')));
	let selectedTypesB = $state<Type[]>(parseTypes(getParams().get('typesB')));

	let camera = $state<Camera | null>(
		getParams().get('lat')
			? {
					center: [Number(getParams().get('lng')), Number(getParams().get('lat'))],
					zoom: Number(getParams().get('zoom')) || 8,
					bearing: 0,
					pitch: 0
				}
			: null
	);

	// Debounce camera so dragging doesn't flood history
	const debouncedCamera = new Debounced(() => camera, 400);

	$effect(() => {
		const _a = yearA;
		const _b = yearB;
		const _cmp = compare;
		const _typesA = selectedTypesA.join(',');
		const _typesB = selectedTypesB.join(',');
		const _cam = debouncedCamera.current;

		if (!browser) return;

		const p = new URLSearchParams();
		p.set('a', String(_a));
		p.set('typesA', _typesA);
		if (_cmp) {
			p.set('compare', 'true');
			p.set('b', String(_b));
			p.set('typesB', _typesB);
		}
		if (_cam) {
			p.set('lat', _cam.center[1].toFixed(5));
			p.set('lng', _cam.center[0].toFixed(5));
			p.set('zoom', _cam.zoom.toFixed(2));
		}

		goto(`?${p.toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	});

	// ── PersistedState (preference state, not shareable) ────────────────────────
	const language = new PersistedState<Language>('language', 'nl');

	// ── Map sync ────────────────────────────────────────────────────────────────
	let leaderId = $state<string | null>(null);
	let userLocation = $state<[number, number] | undefined>(undefined);

	function onCameraChange(id: string | null, newCamera: Camera) {
		leaderId = id;
		camera = newCamera;
	}
</script>

<svelte:head>
	<title>Topotijdreis.be</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<Header bind:userLocation bind:compare bind:camera bind:leaderId language={language.current} />
	<div
		class="flex min-h-0 flex-1 flex-col overflow-hidden
           {compare
			? 'portrait:flex-col portrait:gap-y-1 landscape:flex-row landscape:gap-x-1'
			: ''}"
	>
		<MapWithSlider
			id="a"
			{allLayers}
			{camera}
			{leaderId}
			{userLocation}
			{onCameraChange}
			compact={compare}
			bind:selectedYear={yearA}
			bind:selectedTypes={selectedTypesA}
		/>
		{#if compare}
			<MapWithSlider
				id="b"
				{allLayers}
				{camera}
				{leaderId}
				{userLocation}
				{onCameraChange}
				compact={compare}
				bind:selectedYear={yearB}
				bind:selectedTypes={selectedTypesB}
			/>
		{/if}
	</div>
</div>
