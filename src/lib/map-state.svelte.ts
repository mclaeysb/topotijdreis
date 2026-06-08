import { page } from '$app/state';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { Debounced } from 'runed';
import type { Camera, Type } from '$lib/types/types';

const DEFAULT_TYPES: Type[] = ['topo'];
const DEFAULT_YEAR = 1971;

function parseTypes(raw: string | null): Type[] {
	return raw ? (raw.split(',') as Type[]) : DEFAULT_TYPES;
}

function getParams() {
	return page.url.searchParams;
}

export class MapUrlState {
	year = $state(DEFAULT_YEAR);
	year2 = $state(DEFAULT_YEAR);
	compare = $state(false);
	selectedTypes = $state<Type[]>(DEFAULT_TYPES);
	selectedTypes2 = $state<Type[]>(DEFAULT_TYPES);
	camera = $state<Camera | null>(null);

	#debouncedCamera = new Debounced(() => this.camera, 400);

	constructor() {
		const params = getParams();
		this.year = Number(params.get('year')) || DEFAULT_YEAR;
		this.year2 = Number(params.get('year2')) || DEFAULT_YEAR;
		this.compare = params.get('compare') === 'true';
		this.selectedTypes = parseTypes(params.get('types'));
		this.selectedTypes2 = parseTypes(params.get('types2'));

		if (params.get('lat')) {
			this.camera = {
				center: [Number(params.get('lng')), Number(params.get('lat'))],
				zoom: Number(params.get('zoom')) || 8,
				bearing: 0,
				pitch: 0
			};
		}

		// Setup the sync effect
		$effect(() => {
			if (!browser) return;

			const p = new URLSearchParams();
			p.set('year', String(this.year));
			p.set('types', this.selectedTypes.join(','));

			if (this.compare) {
				p.set('compare', 'true');
				p.set('year2', String(this.year2));
				p.set('types2', this.selectedTypes2.join(','));
			}

			const cam = this.#debouncedCamera.current;
			if (cam) {
				p.set('lat', cam.center[1].toFixed(5));
				p.set('lng', cam.center[0].toFixed(5));
				p.set('zoom', cam.zoom.toFixed(2));
			}

			goto(`?${p.toString()}`, {
				replaceState: true,
				keepFocus: true,
				noScroll: true
			});
		});
	}
}
