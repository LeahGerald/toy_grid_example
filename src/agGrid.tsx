import React from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
//Note; this took me ~1hr

interface gridProps {
  columns: string[];
  rowData: any[]
}

export const AgGrid = ({columns, rowData}: gridProps) => {

   return (
       <div className="ag-theme-alpine" style={{height: '90vw', width: '100vw'}}>
           <AgGridReact
                defaultColDef={{
                  editable: true,
                  resizable: true,
                  minWidth: 100,
                  flex: 1,
                }}
                multiSortKey={'ctrl'}
               rowData={rowData}>
              {columns.map(e => (
                <AgGridColumn field={e} sortable={true} filter="agTextColumnFilter"></AgGridColumn>
              ))}
           </AgGridReact>
       </div>
   );
};
