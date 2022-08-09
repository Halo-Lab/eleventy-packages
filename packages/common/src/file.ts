import {
	rm,
	readFile as readFileFs,
	writeFile as writeFileFs,
} from 'fs/promises';
import {
	PathLike,
	existsSync,
	ReadStream,
	WriteStream,
	createReadStream,
	createWriteStream,
} from 'fs';

export interface File<Content = unknown> {
	readonly name: string;
	readonly content: Content;
}

interface FileAccessor<
	Encoding extends BufferEncoding | undefined = undefined,
> {
	readonly to: (writer: FileWriter) => WriteStream;
	readonly start: () => ReadStream;
	readonly content: () => Promise<
		Encoding extends undefined ? NodeJS.ArrayBufferView : string
	>;
	readonly encoding: <Encoding extends BufferEncoding | undefined = undefined>(
		value?: Encoding,
	) => FileAccessor<Encoding>;
}

export const readFile = (path: PathLike): FileAccessor => {
	let encoding: BufferEncoding | undefined = undefined;

	const start = () => createReadStream(path, { encoding });

	const reader: FileAccessor = {
		// @ts-ignore
		encoding: (value) => {
			encoding = value;
			return reader;
		},
		start,
		// @ts-ignore
		content: () => readFileFs(path, { encoding }),
		to: (writer: FileWriter) => start().pipe(writer.start()),
	};

	return reader;
};

interface FileWriter {
	readonly from: (reader: FileAccessor) => WriteStream;
	readonly data: (
		value:
			| string
			| NodeJS.ArrayBufferView
			| Iterable<string | NodeJS.ArrayBufferView>,
	) => Promise<void>;
	readonly start: () => WriteStream;
	readonly encoding: (type?: BufferEncoding) => FileWriter;
}

export const writeFile = (path: PathLike): FileWriter => {
	let encoding: BufferEncoding | undefined = undefined;

	const start = () => createWriteStream(path, { encoding });

	const writer: FileWriter = {
		encoding: (value) => {
			encoding = value;
			return writer;
		},
		start,
		from: (reader: FileAccessor) => reader.start().pipe(start()),
		data: (
			value:
				| string
				| NodeJS.ArrayBufferView
				| Iterable<string | NodeJS.ArrayBufferView>,
		) => writeFileFs(path, value, { encoding }),
	};

	return writer;
};

export const existsFile = (path: PathLike): boolean => existsSync(path);

export const removeFile = (path: string) => rm(path);
