

/*
*** downloads data as a csv file
*** Expected vals  
*** data : obj Array  i.e: whatever kind Array of objects [{...}]
*** headers: obj Array i.e:   [ { title: "Title", dataAccess: "title" } ]
*** O (ab)
*/
let download = function( data, headers ){
   // console.log("in");
    if(!data || data.length === 0) return null;
    let body = data.map( item => {
        let tempArr = [];
        for(let i = 0; i<headers.length; i++){
            tempArr.push(item[headers[i].dataAccess]);
        }
        return tempArr;
    });
    //console.log("headers", headers);
    
    let csvBody = body.map(e => e.join(",")).join("\n");
    console.log("body",csvBody);
    let csvContent = "data:text/csv;charset=utf-8," + csvBody ;
    console.log("CSV",csvContent);
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "test_csv.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);

}

export default download;