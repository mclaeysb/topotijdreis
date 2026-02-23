<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import { micromark } from 'micromark';
	import { Info } from '@lucide/svelte';
	import type { Language } from '$lib/types/types';

	let {
		text,
		language = $bindable()
	}: {
		text: any;
		language: Language;
	} = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={Button.buttonVariants({ variant: 'ghost' })}
		><Info />
		<div class="hidden md:flex">About</div></Dialog.Trigger
	>

	<Dialog.Content class="flex max-h-[80vh] max-w-300 flex-col">
		<div
			class="prose prose-sm overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] dark:prose-invert [&::-webkit-scrollbar]:hidden"
		>
			{@html micromark(text[language]['about'])}
		</div>
	</Dialog.Content>
</Dialog.Root>
