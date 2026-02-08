import layers from '$lib/content/layers.yml';

export function load() {
	return {
		layers: layers.layers as Array<{
			name: string;
			url: string;
			attribution: string;
			type: string;
			year?: number;
			format?: string;
			layers?: string;
			transparent?: boolean;
			maxZoom?: number;
		}>
	};
}
