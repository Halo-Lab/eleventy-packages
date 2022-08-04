export {};

declare global {
	namespace Eleventy {
		interface Page {
			readonly date: Date;
			readonly inputPath: string;
			readonly fileSlug: string;
			readonly filePathStem: string;
			readonly outputFileExtension: string;
			readonly url: string;
			readonly outputPath: string;
		}

		type TemplateContext<Mixin = {}> = {
			readonly render: () => string;
			readonly page: Page;
			readonly slug: (this: TemplateContext<Mixin>) => string;
			readonly slugify: (this: TemplateContext<Mixin>) => string;
			readonly url: (this: TemplateContext<Mixin>) => string;
			readonly log: (this: TemplateContext<Mixin>) => void;
			readonly serverlessUrl: (this: TemplateContext<Mixin>) => string;
			readonly getCollectionItem: (this: TemplateContext<Mixin>) => unknown;
			readonly getPreviousCollectionItem: (
				this: TemplateContext<Mixin>,
			) => unknown;
			readonly getNextCollectionItem: unknown;
		} & Mixin;
	}
}
