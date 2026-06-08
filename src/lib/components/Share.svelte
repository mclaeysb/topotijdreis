<script lang="ts">
	import { page } from '$app/state';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Button from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { CopyButton } from '$lib/components/ui/copy-button/index.js';
	import { Link, Share } from '@lucide/svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger class={Button.buttonVariants({ variant: 'ghost' })}
		><Share />
		<div class="hidden md:flex">Share</div></Dialog.Trigger
	>

	<Dialog.Content class="flex max-h-[80vh] max-w-300 flex-col">
		<div
			class="prose prose-sm overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] dark:prose-invert [&::-webkit-scrollbar]:hidden"
		>
			<h3>Share</h3>
			<div>
				Copy the URL to share Topotijdreis.be with someone who'd also like to travel back in time.
			</div>

			<div class="mt-4 flex w-full max-w-sm items-center gap-2">
				<div
					class="flex h-8 min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-lg border bg-accent px-2 py-1"
				>
					<Link size={12} class="shrink-0 text-muted-foreground" />
					<span class="truncate text-sm text-muted-foreground">
						{page.url.href}
					</span>
				</div>
				<CopyButton variant="default" class="h-8" text={page.url.href}>Copy</CopyButton>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
