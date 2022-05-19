//import { fileTypeFromBlob } from 'file-type';

export const downloadFile = async function (data, name = 'test', extension) {
	let blob = new Blob([data], { type: 'application/octostream' });
	let url = window.URL || window.webkitURL;
	let link = url.createObjectURL(blob);
	////console.log(await fileTypeFromBlob(blob));
	let a = document.createElement('a');
	a.setAttribute('download', `${name}.${extension}`);
	a.setAttribute('href', link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

export const downloadFileFromJSON = async function (data, name = 'test', extension) {
	let arrayBuffer = new Uint8Array(data);

	let blob = new Blob([arrayBuffer.buffer], { type: 'application/pdf' });
	let url = window.URL || window.webkitURL;
	let link = url.createObjectURL(blob);
	////console.log(await fileTypeFromBlob(blob));
	let a = document.createElement('a');
	a.setAttribute('download', `${name}.${extension}`);
	a.setAttribute('href', link);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
