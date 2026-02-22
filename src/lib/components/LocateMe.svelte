<script lang="ts">
	import { Loader2, LocateFixed } from '@lucide/svelte';
	import { Button } from './ui/button';

	let {
		userLocation = $bindable(),
		locating = false
	}: {
		userLocation?: [number, number];
		locating?: boolean;
	} = $props();

	function requestLocation() {
		locating = true;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				userLocation = [pos.coords.longitude, pos.coords.latitude];
				locating = false;
			},
			(err) => {
				console.error(err);
				locating = false;
			}
		);
	}
</script>

<Button variant="outline" onclick={requestLocation} class="ml-2" title="Locate me">
	{#if locating}
		<Loader2 class="animate-spin" size={20} />
	{:else}
		<LocateFixed size={20} />
	{/if}
	<div class="hidden md:flex">Locate me</div></Button
>
