export type Type = 'topo' | 'osm' | 'aerial' | 'hillshade';

export type RawLayer = {
	name: string;
	url: string;
	attribution: string;
	type: Type;
	year?: number;
	format?: string;
	layers?: string;
	transparent?: boolean;
	maxZoom?: number;
	include?: boolean;
};

export type Layer = RawLayer & {
	year: number;
	previousYear: number;
	nextYear: number;
};
