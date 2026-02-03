import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Spreadsheet.css';

const ItemType = 'ROW';

const DraggableItem = ({ id, index, moveItem, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

const DropTarget = ({ children, index, moveItem }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={drop} className="drop-target">
      {children}
    </div>
  );
};

const TableHeader = ({ columns }) => (
  <div className="row header-row">
    {columns.map((column) => (
      <div
        key={column.id}
        className="header-cell"
        style={{ width: column.width }}
      >
        {column.name}
      </div>
    ))}
  </div>
);

const TableRow = ({ row, rowIndex, columns, handleCellBlur, removeRow, moveRow }) => (
  <DropTarget index={rowIndex} moveItem={moveRow}>
    <DraggableItem id={row.id} index={rowIndex} moveItem={moveRow}>
      <div className="row">
        {row.values.map((value, colIndex) => (
          <div
            key={columns[colIndex].id}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleCellBlur(rowIndex, colIndex, e.target.innerText)}
            className="cell"
            style={{ width: columns[colIndex].width }}
          >
            {value}
          </div>
        ))}
        <button onClick={() => removeRow(rowIndex)} className="remove-row-btn">
          Remove
        </button>
      </div>
    </DraggableItem>
  </DropTarget>
);

const DynamicTable = ({ tableId, title, columns, rows, handleCellBlur, removeRow, moveRow, handleTitleBlur }) => (
  <div className="table" id={tableId}>
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => handleTitleBlur(tableId, e.target.innerText)}
      className="table-title"
    >
      {title}
    </div>
    <TableHeader columns={columns} />
    {rows.map((row, rowIndex) => (
      <TableRow
        key={row.id}
        row={row}
        rowIndex={rowIndex}
        columns={columns}
        handleCellBlur={handleCellBlur}
        removeRow={removeRow}
        moveRow={(fromIndex, toIndex) => moveRow(tableId, fromIndex, toIndex)}
      />
    ))}
    <div className="row">
      {columns.map((column, index) => (
        <div
          key={column.id}
          className={`total-cell ${index === columns.findIndex(col => col.name === 'Value') ? 'total-value' : ''}`}
          style={{ width: column.width }}
        >
          {index === columns.findIndex(col => col.name === 'Value') ? '$' + rows.reduce((sum, row) => {
            const value = row.values[index].replace(/[^0-9.-]+/g, '');
            return sum + (isNaN(value) ? 0 : parseFloat(value));
          }, 0).toFixed(2) : ''}
        </div>
      ))}
    </div>
  </div>
);

const Spreadsheet = () => {
  const [tables, setTables] = useState([
    {
      id: 'table-1',
      title: 'Section 1',
      columns: [
        { id: 'col-1', name: 'Asset', width: 200 },
        { id: 'col-2', name: 'IRR', width: 100 },
        { id: 'col-3', name: 'Value', width: 100 },
      ],
      rows: [
        { id: 'row-1', values: ['Fidelity - Plaid Checking - 0000', 'Cost $238', '$110'] },
        { id: 'row-2', values: ['Fidelity - Plaid 401k - 6666', 'Cost $238', '$23,631'] },
      ],
    },
  ]);

  const addTable = () => {
    setTables([...tables, {
      id: `table-${tables.length + 1}`,
      title: `Section ${tables.length + 1}`,
      columns: [
        { id: `col-${tables.length + 1}-1`, name: 'Asset', width: 200 },
        { id: `col-${tables.length + 1}-2`, name: 'IRR', width: 100 },
        { id: `col-${tables.length + 1}-3`, name: 'Value', width: 100 },
      ],
      rows: [
        { id: `row-${tables.length + 1}-1`, values: ['0', '0', '0'] },
      ],
    }]);
  };

  const addRow = (tableId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newRow = { id: `row-${table.rows.length + 1}`, values: Array(table.columns.length).fill('0') };
        return { ...table, rows: [...table.rows, newRow] };
      }
      return table;
    }));
  };

  const addColumn = (tableId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newColumn = { id: `col-${table.columns.length + 1}`, name: `Column ${table.columns.length + 1}`, width: 100 };
        return {
          ...table,
          columns: [...table.columns, newColumn],
          rows: table.rows.map(row => ({
            ...row,
            values: [...row.values, 'New Value'],
          })),
        };
      }
      return table;
    }));
  };

  const removeRow = (tableId, rowIndex) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: table.rows.filter((_, i) => i !== rowIndex),
        };
      }
      return table;
    }));
  };

  const handleCellBlur = (tableId, rowIndex, colIndex, value) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: table.rows.map((row, rIndex) =>
            rIndex === rowIndex
              ? { ...row, values: row.values.map((val, cIndex) => (cIndex === colIndex ? value : val)) }
              : row
          ),
        };
      }
      return table;
    }));
  };

  const handleTitleBlur = (tableId, title) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          title,
        };
      }
      return table;
    }));
  };

  const moveRow = (tableId, fromIndex, toIndex) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const updatedRows = [...table.rows];
        const [movedRow] = updatedRows.splice(fromIndex, 1);
        updatedRows.splice(toIndex, 0, movedRow);
        return {
          ...table,
          rows: updatedRows,
        };
      }
      return table;
    }));
  };

  const calculateTotalSum = () => {
    return tables.reduce((totalSum, table) => {
      const columnIndex = table.columns.findIndex(col => col.name === 'Value');
      if (columnIndex !== -1) {
        const tableSum = table.rows.reduce((sum, row) => {
          const value = row.values[columnIndex].replace(/[^0-9.-]+/g, '');
          return sum + (isNaN(value) ? 0 : parseFloat(value));
        }, 0);
        return totalSum + tableSum;
      }
      return totalSum;
    }, 0).toFixed(2);
  };

  const totalSum = calculateTotalSum();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="spreadsheet">
        <h1>${totalSum}</h1>
        {tables.map(table => (
          <div className='table-wrap' key={table.id}>
            <DynamicTable
              tableId={table.id}
              title={table.title}
              columns={table.columns}
              rows={table.rows}
              handleCellBlur={(rowIndex, colIndex, value) => handleCellBlur(table.id, rowIndex, colIndex, value)}
              removeRow={(rowIndex) => removeRow(table.id, rowIndex)}
              moveRow={moveRow}
              handleTitleBlur={handleTitleBlur}
            />
            <button onClick={() => addRow(table.id)} className="btn-add-row">Add Asset</button>
          </div>
        ))}
        <button onClick={addTable} className="btn-add-table">Add Section</button>
      </div>
    </DndProvider>
  );
};

export default Spreadsheet;
