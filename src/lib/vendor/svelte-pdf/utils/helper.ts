export const onPrint = (url: string) => {
	let iframe: HTMLIFrameElement | null = null;
	if (!iframe) {
		iframe = document.createElement('iframe');
		document.body.appendChild(iframe);

		iframe.style.display = 'none';
		iframe.onload = function () {
			setTimeout(function () {
				iframe?.focus();
				iframe?.contentWindow?.print();
			}, 1);
		};
	}

	iframe.src = url;
};

export const calcRT = (paraBody: string) => {
	const wordsPerMinute = 200;
	const textLength = paraBody.split(' ').length;
	if (textLength > 0) {
		return Math.ceil(textLength / wordsPerMinute);
	}
	return undefined;
};

export const getPageText = (pageNum: number, PDFDocumentInstance: any): Promise<string> => {
	return new Promise((resolve, reject) => {
		PDFDocumentInstance.getPage(pageNum)
			.then((pdfPage: any) => pdfPage.getTextContent())
			.then((textContent: any) => {
				const textItems = textContent.items;
				let finalString = '';

				for (let i = 0; i < textItems.length; i++) {
					const item = textItems[i] as { str?: string };
					finalString += `${item.str ?? ''} `;
				}

				resolve(finalString);
			})
			.catch((error: unknown) => reject(error));
	});
};

export const savePDF = async ({
	fileUrl,
	data,
	name = 'download.pdf'
}: {
	fileUrl?: string;
	data?: string;
	name?: string;
}) => {
	const link = document.createElement('a');
	link.download = name;
	link.rel = 'noopener';

	let resolvedFileUrl = fileUrl;
	if (!resolvedFileUrl) {
		resolvedFileUrl = `data:application/pdf;base64,${btoa(data ?? '')}`;
	}

	const blobs = await fetch(resolvedFileUrl).then((r) => r.blob());
	if (!blobs || !(blobs instanceof Blob)) {
		console.log('Invalid blob object passed to URL.createObjectURL()');
	}
	if (typeof URL.createObjectURL === 'undefined') {
		console.log('Your browser does not support URL.createObjectURL()');
	}

	const url = URL.createObjectURL(blobs);
	link.href = url;
	link.click();
	URL.revokeObjectURL(link.href);
};
