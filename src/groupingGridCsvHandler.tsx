import { capitalize } from 'lodash';
import type { Column } from 'react-data-grid';

let csvData = new Array();

const url = "f_pilot_queries f_pilot_queries 2021-06-11T1536.csv"
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  


// Retrived data from csv file content
var jsonObject = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObject.length; i++) {
  csvData.push(jsonObject[i].split(','));
}
// set header index name
csvData[0][0] = 'index'
console.log(csvData);

const columns: Column<{[key: string]: string}>[] = csvData[0].map((e: string) => ({key: e, name: capitalize(e)}))
const actualData = csvData.slice(1)
const rows: any[] = []
for (let i = 0; i < actualData.length; i++) {
  const row = actualData[i]
  let entry: any  = {}
  for(let j = 0; j < row.length; j++) {
    entry[columns[j].key] = row[j]
  }
  rows.push(entry)
}

export {columns, rows}
