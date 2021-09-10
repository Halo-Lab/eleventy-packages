/** Compression algorithms that are available for plugin. */
export type CompressAlgorithm = 'brotli' | 'gzip' | 'deflate';

export interface RawContentInfo {
  /** Output URL of raw file. */
  url: string;
  /** Raw content. */
  data: string;
}

export interface CompressedContentInfo {
  /** Output URL of compressed file. */
  url: string;
  /** Compressed content. */
  data: Buffer;
}
