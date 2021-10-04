import { useState, createContext, useContext, useMemo } from 'react';
import { groupBy as rowGrouper } from 'lodash';
import './groupingGrid.css';

import DataGrid from 'react-data-grid';
import { useFocusRef } from './useFocusRef'
import type { Column, HeaderRendererProps } from 'react-data-grid';

interface gridProps {
  columns: Column<{[key: string]: string}>[];
  rowData: any[];
}

const options = ['Pilot Subject ID', 'Visit Name', 'Form Title'] as const;


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
  const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([
    options[0],
    options[1]
  ]);
  const filtertitles: {[key: string]: string } = {}
  columns.forEach(e => {
    if (typeof e.key === 'string') {
      filtertitles[e.key] = ''
    }
  })
  const [filters, setFilters] = useState<{[key: string]: string}>(filtertitles);
  const developerOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r[options[1]]))).map((d) => ({
        label: d,
        value: d
      })),
    [rows]
  );
  const [expandedGroupIds, setExpandedGroupIds] = useState<ReadonlySet<unknown>>(
    () => new Set<unknown>([])
  );
  console.log(filters)

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
      return (
        (filters[columnNames[0]] && r[columnNames[0]] ? r[columnNames[0]].includes(filters[columnNames[0]]) : true) &&
        (filters[columnNames[1]] && r[columnNames[1]] ? r[columnNames[1]].includes(filters[columnNames[1]]) : true) &&
        (filters[columnNames[2]] && r[columnNames[2]] ? r[columnNames[2]].includes(filters[columnNames[2]]) : true) &&
        (filters[columnNames[3]] && r[columnNames[3]] ? r[columnNames[3]].includes(filters[columnNames[3]]) : true) &&
        (filters[columnNames[4]] && r[columnNames[4]] ? r[columnNames[4]].includes(filters[columnNames[4]]) : true) &&
        (filters[columnNames[5]] && r[columnNames[5]] ? r[columnNames[5]].includes(filters[columnNames[5]]) : true) &&
        (filters[columnNames[6]] && r[columnNames[6]] ? r[columnNames[6]].includes(filters[columnNames[6]]) : true) &&
        (filters[columnNames[7]] && r[columnNames[7]] ? r[columnNames[7]].includes(filters[columnNames[7]]) : true) &&
        (filters[columnNames[8]] && r[columnNames[8]] ? r[columnNames[8]].includes(filters[columnNames[8]]) : true) &&
        (filters[columnNames[9]] && r[columnNames[9]] ? r[columnNames[9]].includes(filters[columnNames[9]]) : true) &&
        (filters[columnNames[10]] && r[columnNames[10]] ? r[columnNames[10]].includes(filters[columnNames[10]]) : true) &&
        (filters[columnNames[11]] && r[columnNames[11]] ? r[columnNames[11]].includes(filters[columnNames[11]]) : true) &&
        (filters[columnNames[12]] && r[columnNames[12]] ? r[columnNames[12]].includes(filters[columnNames[12]]) : true) &&
        (filters[columnNames[13]] && r[columnNames[13]] ? r[columnNames[13]].includes(filters[columnNames[13]]) : true) &&
        (filters[columnNames[14]] && r[columnNames[14]] ? r[columnNames[14]].includes(filters[columnNames[14]]) : true)
      )
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
      <FilterContext.Provider value={filters}>
        <DataGrid
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
        />
      </FilterContext.Provider>
    </div>
  );
}
