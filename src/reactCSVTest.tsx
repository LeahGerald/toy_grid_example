import { CSVLink } from "react-csv";
import { capitalize, get } from 'lodash';


let csvData = new Array();

const url = "" // add csv name here (from public folder)
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  


// Retrived data from csv file content
var jsonObject = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObject.length; i++) {
  csvData.push(jsonObject[i].split(','));
}
const headers = csvData[0].map((e: string) => ({key: e, label: capitalize(e)}))
const data = csvData.slice(1)
const rows: any[] = []
for (let i = 0; i < data.length; i++) {
  const row = data[i]
  let entry: any  = {}
  for(let j = 0; j < row.length; j++) {
    entry[headers[j]['key']] = row[j]
  }
  rows.push(entry)
}


const CsvButton = () => (
<CSVLink data={data} headers={headers}>
  Download me
</CSVLink>)

export { CsvButton }
