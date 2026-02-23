<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from './ui/button/button.svelte';
	import { Columns2 } from '@lucide/svelte';
	import LocateMe from './LocateMe.svelte';
	import About from './About.svelte';

	import type { Camera, Language } from '$lib/types/types';

	let {
		text,
		compare = $bindable(),
		userLocation = $bindable(),
		camera = $bindable(),
		leaderId = $bindable(),
		language = $bindable()
	}: {
		text: any;
		compare: boolean;
		userLocation?: [number, number];
		camera: Camera | null;
		leaderId: string | null;
		language: Language;
	} = $props();

	const languages = [
		{ value: 'en', label: 'EN' },
		{ value: 'nl', label: 'NL' },
		{ value: 'fr', label: 'FR' }
	];

	function toggleCompare() {
		compare = !compare;
		if (!compare) {
			leaderId = null;
			camera = null;
		}
	}

	const triggerContent = $derived(languages.find((l) => l.value === language)?.label ?? 'Language');
</script>

<header class="z-20 bg-white">
	<nav
		aria-label="Global"
		class="mx-auto flex items-center justify-between border-b border-stone-300 p-2 shadow-lg md:px-8"
	>
		<div class="flex flex-1 gap-0 md:gap-2">
			<Button
				variant="default"
				class="bg-stone-800"
				aria-label="Toggle compare mode"
				aria-pressed={compare}
				onclick={toggleCompare}
			>
				<Columns2 aria-hidden="true" />
				<span class="hidden md:inline">Compare</span>
			</Button>
			<LocateMe bind:userLocation />
		</div>
		<div class="relative">
			<div class="mr-4 text-xl font-medium text-stone-900 select-none">Topotijdreis.be</div>
		</div>
		<!-- <div class="hidden md:flex md:flex-1 md:justify-end"> -->
		<div class="flex flex-1 justify-end">
			<!-- <Select.Root type="single" bind:value={language}>
				<Select.Trigger class="w-16 border-0 shadow-none">
					{triggerContent}
				</Select.Trigger>
				<Select.Content class="w-16">
					<Select.Group>
						{#each languages as lang (lang.value)}
							<Select.Item value={lang.value} label={lang.label}>
								{lang.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root> -->
			<About {text} {language}></About>
		</div>
	</nav>
</header>
