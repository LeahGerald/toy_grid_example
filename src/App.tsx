import React, {useState} from 'react';
import './App.css';
import Grouping from './groupingGrid';
import {columns as gcolumns, rows as rowData} from './groupingGridCsvHandler'

import { AgGrid } from  './agGrid'
import {rows, columns} from './agGridCsvHandler'
import { CsvButton } from './reactCSVTest';


const App = () => {
  const [gridToggle, setGridToggle] = useState(0)
  
  return (
    <div>
      <CsvButton />
      <button onClick={() => setGridToggle(gridToggle === 1 ? 0 : 1)}>Toggle grid</button>
      {gridToggle === 1 ?
        <Grouping rowData={rowData} columns={gcolumns} />
        : <AgGrid rowData={rows} columns={columns} />
        
      }
      
    </div>
  );
}

export default App;
