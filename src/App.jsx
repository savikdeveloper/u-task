import './App.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo } from 'react';
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";

function App() {
  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "id", sortable: true, filter: true, headerName: "ID" },
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
      headerName: "Rating",
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        const likesCount = (params.data.likesCount || 0);
        const dislikesCount = (params.data.dislikesCount || 0);
        return <>
          <AiTwotoneLike />
          <span>{likesCount}</span>
          <AiTwotoneDislike />
          <span>{dislikesCount}</span>

        </>
      }
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
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className="ag-theme-alpine" style={{height: 500, width: "91%"}}>
        <AgGridReact
          rowData={rowData} 
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection='multiple'
          animateRows={true}
        />
      </div>
    </div>
  )
}

export default App
