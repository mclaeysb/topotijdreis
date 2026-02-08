<script>
	import Header from '$lib/components/Header.svelte';
	import Map from '$lib/components/Map.svelte';
	import YearSlider from '$lib/components/YearSlider.svelte';

	let { data } = $props();

	let years = data.layers.map((layer) => layer.year ?? new Date().getFullYear());
</script>

<div class="grid h-screen grid-cols-[4rem_1fr] grid-rows-[3rem_1fr]">
	<header class="z-20 col-span-2 h-full w-full shadow-md">
		<Header />
		{years}
	</header>

	<aside class="z-15 shadow-md">
		<YearSlider />
	</aside>

	<main class="h-full w-full overflow-hidden">
		<Map />
	</main>
</div>
