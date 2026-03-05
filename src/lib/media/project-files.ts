const IMAGE_FILE_PATTERN = /\.(png|jpe?g|webp|gif)$/i;

export const getProjectFilesByTag = <T>(
	filesByPath: Record<string, T>,
	projectTag: string
): Record<string, T> => {
	return Object.keys(filesByPath)
		.filter((key) => key.includes(`/${projectTag}/`))
		.reduce((acc: Record<string, T>, key) => {
			acc[key] = filesByPath[key];
			return acc;
		}, {});
};

export const getProjectImageKeys = <T>(
	filesByPath: Record<string, T>,
	projectTag: string
): string[] => {
	return Object.keys(filesByPath)
		.filter((path) => path.includes(`/${projectTag}/`) && IMAGE_FILE_PATTERN.test(path))
		.sort((leftPath, rightPath) => leftPath.localeCompare(rightPath, 'en', { numeric: true }));
};
