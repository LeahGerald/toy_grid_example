import { useState } from 'react';
import { groupBy as rowGrouper, capitalize } from 'lodash';
import './groupingGrid.css';

import DataGrid, { SelectColumn } from 'react-data-grid';
import type { Column } from 'react-data-grid';



function rowKeyGetter(row: any) {
  return row.id;
}

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

const columns: Column<any>[] = csvData[0].map((e: string) => ({key: e, name: capitalize(e)}))
console.log(columns)
const actualData = csvData.slice(1)
const createRows: any[] = []
for (let i = 0; i < actualData.length; i++) {
  const row = actualData[i]
  let entry: any  = {}
  for(let j = 0; j < row.length; j++) {
    entry[columns[j].key] = row[j]
  }
  createRows.push(entry)
}
const options = ['Pilot Subject ID', 'Visit Name', 'Form Title'] as const;

export default function Grouping() {
  const [rows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set());
  const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([
    options[0],
    options[1]
  ]);
  const [expandedGroupIds, setExpandedGroupIds] = useState<ReadonlySet<unknown>>(
    () => new Set<unknown>([])
  );

  function toggleOption(option: string, enabled: boolean) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }

  return (
    <div className="groupingClassname">
      <b>Group by columns:</b>
      <div className="optionsClassname">
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(event) => toggleOption(option, event.target.checked)}
            />{' '}
            {option}
          </label>
        ))}
      </div>

      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        groupBy={selectedOptions}
        rowGrouper={rowGrouper}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        defaultColumnOptions={{ resizable: true }}
      />
    </div>
  );
}
