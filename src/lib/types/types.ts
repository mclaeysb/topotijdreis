export type Type = 'topo' | 'osm' | 'aerial' | 'hillshade';

export type RawLayer = {
	name: string;
	description: string;
	url: string;
	urlType: string;
	attribution: string;
	moreInfo?: string;
	type: Type;
	yearStart?: number;
	year?: number;
	format?: string;
	layers?: string;
	transparent?: boolean;
	maxZoom?: number;
	include?: boolean;
	coverage: string;
};

export type SortedLayer = RawLayer & {
	year: number;
};

export type Layer = SortedLayer & {
	previousYear: number;
	nextYear: number;
};
