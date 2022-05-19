//import { fileTypeFromBlob } from 'file-type';

let downloadFile = async function (data, name = 'test', extension) {
	let blob = new Blob([data], { type: 'application/octetstream' });
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

export default downloadFile;
