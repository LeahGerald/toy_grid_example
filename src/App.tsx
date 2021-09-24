import React from 'react';
import { capitalize } from 'lodash'
import './App.css';
import Grouping from './groupingGrid';

import DataGrid from 'react-data-grid';
const url = "f_pilot_queries f_pilot_queries 2021-06-11T1536.csv"
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  

var csvData = new Array();
// Retrived data from csv file content
var jsonObject = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObject.length; i++) {
  csvData.push(jsonObject[i].split(','));
}
// set header index name
csvData[0][0] = 'index'
console.log(csvData);

const columns = csvData[0].map((e: string) => ({key: e, name: capitalize(e)}))
console.log(columns)
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
console.log(columns)
console.log(rows)


function App() {
  return <Grouping />;
}

export default App;
