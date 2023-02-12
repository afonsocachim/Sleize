import { cloneDeep } from "lodash";
import React from "react";

type TableRow = string[];

export const ReactTable = () => {
  const [tableHeadings, setTableHeadings] = React.useState<TableRow>(["title"]);
  const [tableRows, setTableRows] = React.useState<TableRow[]>([["value"]]);

  const addColumn = () => {
    const clonedTableHeadings = cloneDeep(tableHeadings);
    const clonedTableRows = cloneDeep(tableRows);
    clonedTableHeadings.push("");
    clonedTableRows.forEach((row) => row.push(""));
    setTableHeadings(clonedTableHeadings);
    setTableRows(clonedTableRows);
  };

  const deleteColumn = (columnNumber: number) => {
    if (tableHeadings.length <= 1) return;
    const clonedTableHeadings = cloneDeep(tableHeadings);
    const clonedTableRows = cloneDeep(tableRows);
    clonedTableHeadings.splice(columnNumber, 1);
    clonedTableRows.forEach((row) => row.splice(columnNumber, 1));
    setTableHeadings(clonedTableHeadings);
    setTableRows(clonedTableRows);
  };

  const addRow = () => {
    const clonedTableRows = cloneDeep(tableRows);
    const newRow = new Array(clonedTableRows[0].length).fill("");
    clonedTableRows.push(newRow);
    setTableRows(clonedTableRows);
  };

  const deleteRow = (i: number) => {
    if (tableRows.length <= 1) return;
    const clonedTableRows = cloneDeep(tableRows);
    clonedTableRows.splice(i, 1);
    setTableRows(clonedTableRows);
  };

  return (
    <table>
      <tr>
        <th>Index\Title</th>
        {tableHeadings.map((n, columnNumber) => (
          <th key={columnNumber}>
            <input
              value={n}
              onChange={(e) => {
                const clonedTableHeadings = cloneDeep(tableHeadings);
                clonedTableHeadings[columnNumber] = e.target.value;
                setTableHeadings(clonedTableHeadings);
              }}
            />
            <button type="button" onClick={() => deleteColumn(columnNumber)}>
              🗑️
            </button>
          </th>
        ))}
        <th onClick={addColumn}>+</th>
      </tr>
      {tableRows.map((row, rowIndex) => (
        <tr>
          <td>
            {rowIndex}{" "}
            <button type="button" onClick={() => deleteRow(rowIndex)}>
              🗑️
            </button>
          </td>
          {row.map((n, columnIndex) => (
            <td key={columnIndex}>
              <input
                value={n}
                onChange={(e) => {
                  const clonedTableRows = cloneDeep(tableRows);
                  clonedTableRows[rowIndex][columnIndex] = e.target.value;
                  setTableRows(clonedTableRows);
                }}
              />
            </td>
          ))}
        </tr>
      ))}
      <tr>
        <td>
          <button type="button" onClick={addRow}>
            +
          </button>
        </td>
      </tr>
    </table>
  );
};
