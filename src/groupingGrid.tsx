import { useState, createContext, useContext, useMemo } from 'react';
import { groupBy as rowGrouper } from 'lodash';
import './groupingGrid.css';

import DataGrid from 'react-data-grid';
import { useFocusRef } from './useFocusRef'
import type { Column, HeaderRendererProps } from 'react-data-grid';
import { exportToCsv, exportToXlsx, exportToPdf } from './groupingGridExportUtils';

type gridProps = {
  columns: Column<{[key: string]: string}>[];
  rowData: any[];
}

const options = ['Pilot Subject ID', 'Visit Name', 'Form Title', 'CRC', 'Query Type', 'Query Status', 'Query Raised By Role'] as const;

function ExportButton({
  onExport,
  children
}: {
  onExport: () => Promise<unknown>;
  children: React.ReactChild;
}) {
  const [exporting, setExporting] = useState(false);
  return (
    <button
      disabled={exporting}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? 'Exporting' : children}
    </button>
  );
}

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<{[key: string]: string} | undefined>(undefined);

function rowKeyGetter(row: any) {
  return row.id;
}

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}
function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
  }
}

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children
}: HeaderRendererProps<R, SR> & {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: {[key: string]: string};
  }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);

  return (
    <>
      <div>{column.name}</div>
      <div>{children({ ref, tabIndex, filters })}</div>
    </>
  );
}


export default function Grouping({columns, rowData}: gridProps) {
  const [rows] = useState(rowData);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set());
  const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([]);
  const filtertitles: {[key: string]: string } = {}
  columns.forEach(e => {
    if (typeof e.key === 'string') {
      filtertitles[e.key] = ''
    }
  })
  const [filters, setFilters] = useState<{[key: string]: string}>(filtertitles);
  const [expandedGroupIds, setExpandedGroupIds] = useState<ReadonlySet<unknown>>(
    () => new Set<unknown>([])
  );

  const columnz = useMemo((): readonly Column<{[key: string]: string}>[] => {
    return columns.map((beep: Column<{[key: string]: string}>) => (
      {
        key: beep.key,
        name: beep.name,
        headerCellClass: 'filter-cell',
        headerRenderer: (p) => (
          <FilterRenderer<any, unknown, HTMLInputElement> {...p}>
            {({ filters, ...rest }) => (
                <input
                  {...rest}
                  className='filterClassname'
                  value={filters[beep.key]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      [beep.key]: e.target.value
                    })
                  }
                  onKeyDown={inputStopPropagation}
                />
            )}
          </FilterRenderer>
        )
      }
    ))
  }, [columns])
  
  const filteredRows = useMemo(() => {
    const columnNames = Object.keys(rows[0])
    return rows.filter((r) => {
      return columnNames.reduce((a, b) => {
        return a && (filters[b] && r[b] ? r[b].includes(filters[b]) : true)
      }, true)
    });
  }, [rows, filters]);

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

  const gridElement = (
    <DataGrid
      columns={columns}
      rows={rows}
    />
  );

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
      <div className='toolbarClassname'>
        <ExportButton onExport={() => exportToCsv(gridElement, 'example_export.csv')}>
          Export to CSV
        </ExportButton>
        <ExportButton onExport={() => exportToXlsx(gridElement, 'example_export.xlsx')}>
          Export to XSLX
        </ExportButton>
        <ExportButton onExport={() => exportToPdf(gridElement, 'example_export.pdf')}>
          Export to PDF
        </ExportButton>
      </div>
      <FilterContext.Provider value={filters}>
        {<DataGrid
          columns={columnz}
          rows={filteredRows}
          rowKeyGetter={rowKeyGetter}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          groupBy={selectedOptions}
          rowGrouper={rowGrouper}
          expandedGroupIds={expandedGroupIds}
          onExpandedGroupIdsChange={setExpandedGroupIds}
          defaultColumnOptions={{ resizable: true }}
          headerRowHeight={70}
        />}
      </FilterContext.Provider>
    </div>
  );
}
