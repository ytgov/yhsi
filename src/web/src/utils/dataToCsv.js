let download = function( csv, name = 'test' ){
    const anchor = document.createElement('a');
    anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    anchor.target = '_blank';
    anchor.download = `${name}.csv`;
    anchor.click();
}

export default download;