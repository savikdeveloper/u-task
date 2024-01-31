import './App.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo } from 'react';
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";

import { BsCheckCircle } from "react-icons/bs";
import { VscError } from "react-icons/vsc";

function App() {
  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "id", sortable: true, filter: true, headerName: "ID" },
    { field: "title", sortable: true, filter: true },
    {
      field: "tags",
      width: 330,
      headerName: "Tags",
      cellRenderer: (params) => {
        const tagNames = params.value.map((tag, index) => <span className='tags' key={index}>{tag.name}</span>);
        return <div>{tagNames}</div>;
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
    { 
      field: "solved",
      headerName: "Attemps",
      sortable: true, 
      filter: true, 
      cellRenderer: (params) => {
        const likesCount = (params.data.solved || 0);
        const dislikesCount = (params.data.notSolved || 0);
        return <>
          <span style={{color: 'green'}}><BsCheckCircle /></span>
          <span>{likesCount}</span> / <span style={{color: 'red'}}><VscError /></span><span>{dislikesCount}</span>
        </>
      }
    },
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
      <div className="ag-theme-alpine" style={{height: 500, width: "100%"}}>
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
