import layers from '$lib/content/layers.yml';

import type { RawLayer } from '$lib/types/types';

export function load() {
	return {
		layers: layers as RawLayer[]
	};
}
