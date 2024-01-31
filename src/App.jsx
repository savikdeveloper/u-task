import './App.css'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState, useEffect, useMemo } from 'react';

function App() {
  const [rowData, setRowData] = useState([]);
  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "id", sortable: true, filter: true },
    { field: "title", sortable: true, filter: true },
    { field: "tags", headerName: "Tags" },
    { field: "difficultyTitle", sortable: true, filter: true },
    { field: "likesCount", headerName: "Rating", sortable: true, filter: true},
    { field: "solved", sortable: true, filter: true },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true
  }), [])

  useEffect(() => {
    fetch('https://kep.uz/api/problems') // Fetch data from server
      .then(result => result.json()) // Convert to JSON
      .then(rowData => setRowData(rowData.data)); // Update state of `rowData`
  }, [])

  return (
    <div className="ag-theme-quartz" style={{ height: 500 , width: 1250}}>
      <AgGridReact 
        rowData={rowData} 
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowSelection='multiple'
        animateRows={true}
      />
    </div>
  )
}

export default App
