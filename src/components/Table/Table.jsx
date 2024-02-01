import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo } from 'react';
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";

import { BsCheckCircle } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { useHistory } from 'react-router-dom';

function Table() {
  const [rowData, setRowData] = useState([]);
  const queryParams = new URLSearchParams(document.location.search);
  const [pageParam, setPageParam] = useState(queryParams.get("page") || 1)
  const [pageCount, setPageCount] = useState();
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [colDefs, setColDefs] = useState([
    { field: "id", sortable: true, filter: true, headerName: "ID" },
    { field: "title", sortable: true, filter: true },
    {
      field: "tags",
      width: 330,
      headerName: "Tags",
      sortable: true,
      filter: false,
      cellRenderer: (params) => {
        const tagNames = params.value.map((tag, index) => <span className='tags' key={index}>{tag.name}</span>);
        return <div>{tagNames}</div>;
      },
    },
    { 
      field: "difficultyTitle", 
      sortable: true, 
      filter: true, 
    },
    {
      headerName: "Rating",
      sortable: true,
      filter: false,
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
      filter: false, 
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

  const history = useHistory();
  const nextBtnFunc = () => {
    if(parseInt(pageParam) >= pageCount) {
      setNextBtnDisabled(true)
    }
    else {
      setNextBtnDisabled(false)
    }
  }
  const prevBtnFunc = () => {
    if(parseInt(pageParam) <= 1) {
      setPrevBtnDisabled(true)
    }
    else {
      setPrevBtnDisabled(false)
    }
  }
  
  const fetchData = async() => {
    await fetch(`https://kep.uz/api/problems?page=${pageParam}`)
      .then(result => result.json())
      .then(rowData => (setRowData(rowData.data), setPageCount(rowData.pagesCount)));
    await nextBtnFunc();
    await prevBtnFunc();
  } 

  useEffect(() => {
    fetchData();
  }, [pageParam])
  
  const handleNextPage = (e) => {
    setPageParam(parseInt(pageParam) +1)
    history.push(`/?page=${parseInt(pageParam) + 1}`);
  }
  console.log(pageParam)
  const handlePrevPage = () => {
    setPageParam(parseInt(pageParam) -1)
    history.push(`/?page=${parseInt(pageParam) - 1}`);
  }
  
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className="ag-theme-alpine" style={{height: 550, width: "100%"}}>
          <AgGridReact
            rowData={rowData} 
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowSelection='multiple'
          />
        </div>
      </div>
      <div>
        <button disabled={prevBtnDisabled} onClick={handlePrevPage}>Prev</button>
        <span>{pageParam} / {pageCount}</span>
        <button disabled={nextBtnDisabled} onClick={handleNextPage}>Next</button>
      </div>
    </>
  )
}

export default Table
