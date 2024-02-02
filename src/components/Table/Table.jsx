import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo } from 'react';
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { useHistory } from 'react-router-dom';
import { Pagination } from 'antd';

function Table() {
  const [rowData, setRowData] = useState([]);
  const queryParams = new URLSearchParams(document.location.search);
  const [pageParam, setPageParam] = useState(queryParams.get("page") || 1)
  const [pageCount, setPageCount] = useState();

  const handlePageChange = (page) => {
    setPageParam(page);
    history.push(`/?page=${page}`);
  };

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
  
  const fetchData = async() => {
    await fetch(`https://kep.uz/api/problems?page=${pageParam}`)
      .then(result => result.json())
      .then(rowData => (setRowData(rowData.data), setPageCount(rowData.pagesCount)));
  } 

  useEffect(() => {
    fetchData();
  }, [pageParam])
  
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
      <div className='pagination_container'>
        <Pagination current={parseInt(pageParam)} onChange={handlePageChange} pageSizeOptions={[10]} total={810} />
      </div>
    </>
  )
}

export default Table
