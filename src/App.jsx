import './App.css'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useState, useEffect, useMemo } from 'react';

function App() {
  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "id", sortable: true, filter: true },
    { field: "title", sortable: true, filter: true },
    {
      field: "tags",
      headerName: "Tags",
      valueFormatter: (params) => {
        const tagNames = params.value.map(tag => tag.name).join(", ");
        return tagNames;
      },
    },
    { field: "difficultyTitle", sortable: true, filter: true },
    {
      field: "likesCount",
      headerName: "Rating",
      sortable: true,
      filter: true,
      valueGetter: (params) => {
        const likesCount = params.data.likesCount || 0;
        const dislikeCount = params.data.dislikeCount || 0;
        return `Like ${likesCount} / Dislike ${dislikeCount}`;
      },
    },
    { field: "solved", sortable: true, filter: true },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }), [])

  useEffect(() => {
    fetch('https://kep.uz/api/problems')
      .then(result => result.json())
      .then(rowData => setRowData(rowData.data));
  }, [])

  return (
    <div className="ag-theme-quartz" style={{height: 500}}>
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
