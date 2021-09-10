declare module '@11ty/eleventy-img' {
  export interface Metadata {
    readonly [key: string]: ReadonlyArray<ImageMetadata>;
  }

  export interface ImageMetadata {
    readonly url: string;
    readonly size: number;
    readonly width: number;
    readonly height: number;
    readonly format: string;
    readonly srcset: string;
    readonly filename: string;
    readonly ouputPath: string;
    readonly sourceType: string;
  }

  interface ProcessImage {
    (source: string, options?: object): Promise<Metadata>;

    concurrency: number;
    statsSync: (source: string, options?: object) => Metadata;
  }
  const processImage: ProcessImage;
  export default processImage;
}
