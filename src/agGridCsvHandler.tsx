

const url = "f_pilot_queries f_pilot_queries 2021-06-11T1536.csv"
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  

var rows = new Array();
// Retrived data from csv file content
var jsonObject = request.responseText.split(/\r?\n|\r/);

const columns = jsonObject[0].split(',')
for (var i = 1; i < jsonObject.length; i++) {
  const vals = jsonObject[i].split(',')
  const row: any = {}
  for (let i = 0; i < columns.length; i++) {
    row[columns[i]] = vals[i] 
  }
  rows.push(row)
}


export {columns, rows}
