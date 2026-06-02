import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../css/Spreadsheet.css';

const ItemType = 'ROW';

// Draggable Row Component
const DraggableItem = ({ id, index, tableId, moveItem, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index, tableId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable-item-container"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div className="drag-handle" title="Drag to reorder row">
        <i className="fas fa-grip-vertical"></i>
      </div>
      {children}
    </div>
  );
};

// Drop Target Component
const DropTarget = ({ children, index, tableId, moveItem }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index || item.tableId !== tableId) {
        moveItem(item.tableId, tableId, item.index, index);
        item.index = index;
        item.tableId = tableId;
      }
    },
  });

  return (
    <div ref={drop} className="drop-target-container">
      {children}
    </div>
  );
};

// Table Header Component
const TableHeader = () => (
  <div className="sheet-row header-row">
    <div className="header-cell asset-col">Asset</div>
    <div className="header-cell irr-col">IRR</div>
    <div className="header-cell value-col">Value</div>
    <div className="header-cell action-col">Actions</div>
  </div>
);

// Table Row Component
const TableRow = ({ row, rowIndex, columns, tableId, handleCellBlur, removeRow, moveRow }) => (
  <DropTarget index={rowIndex} tableId={tableId} moveItem={moveRow}>
    <DraggableItem id={row.id} index={rowIndex} tableId={tableId} moveItem={moveRow}>
      <div className="sheet-row body-row">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleCellBlur(tableId, rowIndex, 0, e.target.innerText)}
          className="sheet-cell asset-col editable-cell"
          placeholder="Enter Asset..."
        >
          {row.values[0]}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleCellBlur(tableId, rowIndex, 1, e.target.innerText)}
          className="sheet-cell irr-col editable-cell"
          placeholder="e.g. 10%"
        >
          {row.values[1]}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleCellBlur(tableId, rowIndex, 2, e.target.innerText)}
          className="sheet-cell value-col editable-cell"
          placeholder="$0.00"
        >
          {row.values[2]}
        </div>
        <div className="sheet-cell action-col">
          <button 
            onClick={() => removeRow(tableId, rowIndex)} 
            className="btn-delete-row"
            title="Remove row"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </DraggableItem>
  </DropTarget>
);

// Table Footer Component
const TableFooter = ({ columns, rows }) => {
  const valueIndex = columns.findIndex(col => col.name === 'Value');
  const totalSum = rows.reduce((sum, row) => {
    const rawVal = row.values[valueIndex] || '';
    const cleanVal = rawVal.replace(/[^0-9.-]+/g, '');
    const numericVal = parseFloat(cleanVal);
    return sum + (isNaN(numericVal) ? 0 : numericVal);
  }, 0).toFixed(2);

  return (
    <div className="sheet-row footer-row">
      <div className="footer-cell asset-col">Total Section Sum</div>
      <div className="footer-cell irr-col"></div>
      <div className="footer-cell value-col total-value-text">${totalSum}</div>
      <div className="footer-cell action-col"></div>
    </div>
  );
};

// Dynamic Table Component
const DynamicTable = ({ tableId, title, columns, rows, handleCellBlur, removeRow, moveRow, handleTitleBlur, addRow }) => (
  <div className="sheet-table-card" id={tableId}>
    <div className="table-card-header">
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleTitleBlur(tableId, e.target.innerText)}
        className="table-editable-title"
        placeholder="Enter Section Title..."
      >
        {title}
      </div>
    </div>
    
    <div className="table-body">
      <TableHeader />
      {rows.map((row, rowIndex) => (
        <TableRow
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          columns={columns}
          tableId={tableId}
          handleCellBlur={handleCellBlur}
          removeRow={removeRow}
          moveRow={moveRow}
        />
      ))}
    </div>

    <div className="table-card-footer">
      <TableFooter columns={columns} rows={rows} />
      <button onClick={() => addRow(tableId)} className="btn-add-row">
        <i className="fas fa-plus"></i> Add Asset Row
      </button>
    </div>
  </div>
);

// Tabs Component
const Tabs = ({ tabs, activeTab, setActiveTab, addTab, updateTabName }) => (
  <div className="sheet-tabs-container">
    <div className="sheet-tabs-list">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`sheet-tab-item ${activeTab === index ? 'active' : ''}`}
          onClick={() => setActiveTab(index)}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateTabName(index, e.target.innerText)}
            className="tab-editable-name"
          >
            {tab.name}
          </span>
        </div>
      ))}
      <button onClick={addTab} className="btn-add-sheet">
        <i className="fas fa-plus-circle"></i> Add New Sheet
      </button>
    </div>
  </div>
);

// Spreadsheet Component
const Spreadsheet = () => {
  const tableIdCounter = useRef(1);
  const rowIdCounter = useRef(1);

  // Create Default Table Function with Empty Rows
  const createDefaultTable = () => ({
    id: `table-${tableIdCounter.current++}`,
    title: `Section ${tableIdCounter.current - 1}`,
    columns: [
      { id: 'col-1', name: 'Asset', width: 200 },
      { id: 'col-2', name: 'IRR', width: 100 },
      { id: 'col-3', name: 'Value', width: 100 },
    ],
    rows: [
      { id: `row-${rowIdCounter.current++}`, values: ['', '', ''] },
      { id: `row-${rowIdCounter.current++}`, values: ['', '', ''] },
    ],
  });

  const [tabs, setTabs] = useState([{ id: 'tab-1', name: '#Sheet 1', tables: [createDefaultTable()] }]);
  const [activeTab, setActiveTab] = useState(0);

  // Add Tab Handler
  const addTab = () => {
    const newTab = {
      id: `tab-${tabs.length + 1}`,
      name: `#Sheet ${tabs.length + 1}`,
      tables: [createDefaultTable()],
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  // Add Table Handler
  const addTable = (tabId) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabId) {
        const newTable = createDefaultTable();
        return { ...tab, tables: [...tab.tables, newTable] };
      }
      return tab;
    }));
  };

  // Add Row Handler
  const addRow = (tableId) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabs[activeTab].id) {
        return {
          ...tab,
          tables: tab.tables.map(table => {
            if (table.id === tableId) {
              const newRow = { id: `row-${rowIdCounter.current++}`, values: Array(table.columns.length).fill('') };
              return { ...table, rows: [...table.rows, newRow] };
            }
            return table;
          }),
        };
      }
      return tab;
    }));
  };

  // Remove Row Handler
  const removeRow = (tableId, rowIndex) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabs[activeTab].id) {
        return {
          ...tab,
          tables: tab.tables.map(table => {
            if (table.id === tableId) {
              return {
                ...table,
                rows: table.rows.filter((_, i) => i !== rowIndex),
              };
            }
            return table;
          }),
        };
      }
      return tab;
    }));
  };

  // Handle Cell Blur
  const handleCellBlur = (tableId, rowIndex, colIndex, value) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabs[activeTab].id) {
        return {
          ...tab,
          tables: tab.tables.map(table => {
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
          }),
        };
      }
      return tab;
    }));
  };

  // Handle Title Blur
  const handleTitleBlur = (tableId, title) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabs[activeTab].id) {
        return {
          ...tab,
          tables: tab.tables.map(table => {
            if (table.id === tableId) {
              return {
                ...table,
                title,
              };
            }
            return table;
          }),
        };
      }
      return tab;
    }));
  };

  // Move Row Handler
  const moveRow = (fromTableId, toTableId, fromIndex, toIndex) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabs[activeTab].id) {
        // Find the row that is being moved
        let movedRow;
        const updatedTables = tab.tables.map(table => {
          if (table.id === fromTableId) {
            const updatedRows = [...table.rows];
            [movedRow] = updatedRows.splice(fromIndex, 1);
            return { ...table, rows: updatedRows };
          }
          return table;
        });

        // Add the row to the new table
        return {
          ...tab,
          tables: updatedTables.map(table => {
            if (table.id === toTableId && movedRow) {
              const updatedRows = [...table.rows];
              updatedRows.splice(toIndex, 0, movedRow);
              return { ...table, rows: updatedRows };
            }
            return table;
          }),
        };
      }
      return tab;
    }));
  };

  // Calculate Total Sum
  const calculateTotalSum = () => {
    return tabs.reduce((totalSum, tab) => {
      const tabSum = tab.tables.reduce((tabSum, table) => {
        const tableSum = table.rows.reduce((sum, row) => {
          const valueIndex = table.columns.findIndex(col => col.name === 'Value');
          const value = row.values[valueIndex] || '';
          const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
          return sum + (isNaN(numericValue) ? 0 : numericValue);
        }, 0);
        return tabSum + tableSum;
      }, 0);
      return totalSum + tabSum;
    }, 0).toFixed(2);
  };

  // Update Tab Name Handler
  const updateTabName = (tabIndex, newName) => {
    setTabs(tabs.map((tab, index) => {
      if (index === tabIndex) {
        return { ...tab, name: newName };
      }
      return tab;
    }));
  };

  // Render
  const currentTab = tabs[activeTab];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="spreadsheet-portal">
        <div className="spreadsheet-header">
          <div className="header-meta">
            <h2>Financial Spreadsheet Dashboard</h2>
            <p className="subtitle">Drag, drop, and edit assets to manage your corporate portfolios</p>
          </div>
          <div className="total-portfolio-sum">
            <span className="sum-label">Global Total Portfolio Sum</span>
            <span className="sum-val">${calculateTotalSum()}</span>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          addTab={addTab}
          updateTabName={updateTabName}
        />

        <div className="sheet-tables-list-container">
          {currentTab.tables.map(table => (
            <DynamicTable
              key={table.id}
              tableId={table.id}
              title={table.title}
              columns={table.columns}
              rows={table.rows}
              handleCellBlur={handleCellBlur}
              removeRow={removeRow}
              moveRow={moveRow}
              handleTitleBlur={handleTitleBlur}
              addRow={addRow}
            />
          ))}

          <div className="add-table-btn-container">
            <button onClick={() => addTable(currentTab.id)} className="btn-add-table">
              <i className="fas fa-plus"></i> Add New Table Section
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Spreadsheet;
