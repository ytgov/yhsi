let downloadPdf = function( data, name = 'test' ){
    let blob = new Blob([data], { type: "application/octetstream" });
    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob);
    let a = document.createElement("a");
    a.setAttribute("download", `${name}.pdf`);
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export default downloadPdf;