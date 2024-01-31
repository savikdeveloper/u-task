import './App.css'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState, useEffect } from 'react';

function App() {
  const [rowData, setRowData] = useState([]);
  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "id" },
    { field: "title" },
    { field: "tags" },
    { field: "difficultyTitle" },
    { field: "likesCount"},
    { field: "solved" },
  ]);

  useEffect(() => {
    fetch('https://kep.uz/api/problems') // Fetch data from server
      .then(result => result.json()) // Convert to JSON
      .then(rowData => setRowData(rowData.data)); // Update state of `rowData`
  }, [])

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  )
}

export default App
