import { sep } from 'path';

import { separateCriticalCSS } from '../src/critical';
import { getEleventyOutputDirectory } from '../../common/src/linker';

const mockDataOptions = {
	outputPath: `_site${sep}index.html`,
};

const mockDataHtmlFile = `
				<link rel="stylesheet" href="main.scss"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"/>
`;

// TODO TEST (NOT WORKING!)
describe('separateCriticalCSS', () => {
	it('should return ...', async () => {
		// const result = await separateCriticalCSS({
		// 	html: mockDataHtmlFile,
		// 	buildDirectory: getEleventyOutputDirectory(mockDataOptions.outputPath),
		// 	criticalOptions: {
		// 		height: 100
		// 	}
		// });
		//
		// console.log(result);
	});
});
