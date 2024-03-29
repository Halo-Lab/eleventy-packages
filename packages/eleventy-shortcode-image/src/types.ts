export interface AdditionalOptions {
	/**
	 * If this option is `true`,then HTML will be generated and
	 * inserted into template. Otherwise, info about image will
	 * be returned. For now is used for SVG.
	 * By default, is `false`.
	 */
	readonly toHTML?: boolean;
	readonly shouldDeleteViewBox?: boolean;
	readonly shouldDeleteDimensions?: boolean;
}

export type ImageProperties = Record<string, string | number> &
	AdditionalOptions & {
		/**
		 * Defines that image should be loaded lazily.
		 * Notifies plugin that _src_ and _srcset_ should not
		 * be set directly, but to other custom attributes.
		 */
		readonly lazy?: boolean;
		/**
		 * It specifies different image widths.
		 * If not defined, then `sizes` attribute won't be
		 * included to the `<source>` element.
		 */
		readonly sizes?: string;
		/** Class names for <img>. */
		readonly classes?: string | ReadonlyArray<string>;
		/** Name of the custom _src_ attribute for lazy loaded image. */
		readonly srcName?: string;
		/** Name of the custom _srcset_ attribute for lazy loaded image. */
		readonly srcsetName?: string;
	};
