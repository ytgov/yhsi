

/*
*** downloads data as a csv file
*** Expected vals  
*** data : obj Array  i.e: whatever kind Array of objects [{...}]
*** headers: obj Array i.e:   [ { title: "Title", dataAccess: "title" } ]
*** O (ab)
*/

// let csvFileData = [  
//     ['Alan Walker', 'Singer'],  
//     ['Cristiano Ronaldo', 'Footballer'],  
//     ['Saina Nehwal', 'Badminton Player'],  
//     ['Arijit Singh', 'Singer'],  
//     ['Terence Lewis', 'Dancer'] ,
//     ['Terence Lewis', 'Dancer'],
//     ['Terence Lewis', 'Dancer'],
//     ['Terence Lewis', 'Dancer']
//  ];  


let download = function( csv, name = 'test' ){
    // let url = window.URL || window.webkitURL;
    // let link = url.createObjectURL(csv);
    // let a = document.createElement("a");
    // a.setAttribute("download", `${name}.csv`);
    // a.setAttribute("href", link);
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    let encodedUri = encodeURI(csv);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name}.csv`);
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
}

export default download;