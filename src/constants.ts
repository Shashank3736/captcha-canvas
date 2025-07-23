export interface SetDimensionOption {
	height?: number;
	width?: number;
}

export interface SetCaptchaOptions {
	characters?: number;
	text?: string;
	color?: string;
	font?: string;
	skew?: boolean;
	colors?: string[];
	rotate?: number;
	size?: number;
	opacity?: number;
	start?: number;
	end?: number;
}

export interface SetTraceOptions {
	color?: string;
	size?: number;
	opacity?: number;
}

export interface SetDecoyOptions {
	color?: string;
	font?: string;
	size?: number;
	opacity?: number;
}

export const defaultCaptchaOptions: SetCaptchaOptions = {
	characters: 6,
	size: 40,
	font: 'Sans',
	skew: true,
	colors: [],
	rotate: 5,
	color: '#32cf7e',
	opacity: 0.8,
};

export const defaultTraceOptions: SetTraceOptions = {
	size: 3,
	color: '#32cf7e',
	opacity: 1,
};

export const defaultDecoyOptions: SetDecoyOptions = {
	color: '#646566',
	font: 'Sans',
	size: 20,
	opacity: 0.8,
};