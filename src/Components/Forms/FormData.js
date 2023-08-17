import React, { useEffect, useState,useRef } from 'react';
import { MaterialReactTable } from 'material-react-table';
import axios from 'axios';
import back from '../../image/back.png';
import { Box, Link, Paper, Typography } from '@mui/material';

import {  Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import ReactDOM from 'react-dom';





const FormData = ({ id, _formDetails }) => {
  const [formData, setFormData] = useState([]);
  const [columns, setColumns] = useState([]);
  const tableElem = useRef();

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);

  function replaceNullWithEmptyString(obj) {
    if (obj === null) {
      return '';
    }
  
    if (typeof obj === 'object') {
      for (let key in obj) {
        obj[key] = replaceNullWithEmptyString(obj[key]);
      }
    }
  
    return obj;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+`/api/getFormData/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        const result = response.data;
        if (result) {
          var x=[]
          result.forEach(r => {
                    console.log(r);

            r.data.id=r.id
            r.data.formid=r.formid
            r.data.dateadded=r.dateadded
            x.push(replaceNullWithEmptyString(r.data))
          });
          console.log(x)
          setFormData(x);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();


    var c=[]
    const indexToInsert = _formDetails.length - 1;

// Use the splice() method to insert the element at the desired index
_formDetails.splice(indexToInsert, 0, {
  id:"dateadded",
  label:"تاريخ الاضافة",
  type:"date"
});

    _formDetails.forEach(header => {

      console.log(header["id"])
      if(header.id!="isSale"){
        c.push(   {
          id: header["id"],
          header:header.label,
          accessorKey: header["id"],
          Cell: ({ row }) => {
        
            if(header.id=="dateadded"){
              const inputDate = new Date(row.original[header.id]);
              const formattedDate = inputDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              return (
           
                <div className=" text-end  fw-bolder">
                
                  {
                  
                  formattedDate }
              
                </div>
              )
            }
            else
            return (
           
            <div className=" text-end  fw-bolder">
            
              {
              
              isURL(row.original[header.id])?
            
              <a
              href={row.original[header.id]}
  
            >
             <img src={back}/>
            </a>:typeof(row.original[header.id])=="boolean"?row.original[header.id]?"نعم":"لا":row.original[header.id]
              }
          
            </div>
          )},
        }) 
      }

    
      else{


        c.push(   {
          id: header["id"],
          header:header.label,
          accessorKey: header["id"],
          Cell: ({ row }) => {
           
            const handleSaleChange = async (event) => {
              const isChecked = event.target.checked;
          
              try {
                const dataId = row.original.id; // Assuming there's an "id" property in the form data
                const body = { dataId };
                const token = sessionStorage.getItem("token");
                if (isChecked) {
                  await axios.post(process.env.REACT_APP_API_URL+`/api/activateSale`, body, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  row.original.isSale = true; 
                } else {
                  await axios.post(process.env.REACT_APP_API_URL+`/api/deactivateSale`, body, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  row.original.isSale = false;
                }
                fetchData();
              } catch (error) {
                // Handle error or display an error message
              }
            };
          
            return (
              <div className="text-end fw-bolder">
                <input
                  type="checkbox"
                  checked={row.original.isSale}
                  onChange={handleSaleChange}
                />
               
              </div>
            );},
        }) 

        c.push(   {
          id: header["id"],
          header:"",
          accessorKey: header["id"],
          Cell: ({ row }) => {
           
            const handleDelete = async () => {
              const dataId = row.original.id; // Assuming there's an "id" property in the form data
              const body = { dataId };
              const token = sessionStorage.getItem("token");
              try{
      await axios.get(process.env.REACT_APP_API_URL+`/api/deleteFormData/`+dataId, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchData();
  
  
              }
              catch{
  
              }
          
            };
          
            return (
              <div className="text-end fw-bolder">
  
  
  
               
               <button type="button" class="btn btn-danger" onClick={handleDelete}>حذف</button>
  
              </div>
            );},
        }) 












      
      }
   

    });

    setColumns(c)
  }, []);

 function isURL(str) {
   try {
     var url = new URL(str);
     return true;
   } catch (_) {
     return false;
   }
 }

 const handleExportRows = (rows) => {
  const tt=rows.map((row) => row.original)
csvExporter.generateCsv(rows.map((row) => row.original));

};

const handleExportData = () => {
  csvExporter.generateCsv(formData);
};

const generatePDFSelected = async (rows) => {
  // Fetch your JSON data and headers
  const jsonData = rows.map((row) => row.original);
  var headers = columns.map((c) => c.header);

  console.log(jsonData[0]);
  console.log(headers);
  // Create a table element with Bootstrap classes
  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Add headers to the table with Bootstrap classes
  const headerRow = table.insertRow();
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.className = 'text-center';
    th.innerText = header;
    headerRow.appendChild(th);
  });

  // Add data rows to the table
  jsonData.forEach((dataItem, index) => {
    const row = table.insertRow();
    const values = Object.values(dataItem);

    for (let i = 0; i < values.length - 3; i++) {
      const cell = row.insertCell();
      if(isURL(values[i]))
      {
        const qrCom=createQr(values[i])
        cell.appendChild(qrCom)
        
       
      }
      else
      cell.innerText = values[i];
      // Apply styles to the cell
      cell.style.border = '1px solid black';
      cell.style.backgroundColor = index % 2 === 0 ? '#B8DAFF' : '#ffffff';
    }
  });

  document.body.appendChild(table);
  // Convert the table to a canvas using html2canvas
  setTimeout(async function(){ 

    const canvas = await html2canvas(table);

    // Convert the canvas to an image data URL
    const imageData = canvas.toDataURL('image/jpg');
    const image = new Image();
  
    image.onload = function () {
      const width = image.width;
      const height = image.height;
  
      console.log('Image Width:', width, 'px');
      console.log('Image Height:', height, 'px');
      const pdf = new jsPDF(width>height?'l':'p', 'px', [(width * 0.57) + 10, (height * 0.57) + 10]); // Create a new PDF instance
      // Add the image data to the PDF
      pdf.addImage(image, 'jpg', 10, 10, 0, 0);
  
      // Save the PDF
      pdf.save('output.pdf');
      document.body.removeChild(table)
    };
  
    image.src = imageData;


  }, 200);
};

const createQr = (value) => {
  const qrCodeElement = document.createElement('div');
  ReactDOM.render(<QRCode value={value} />, qrCodeElement);
  return qrCodeElement;
};
const generatePDF = async () => {
  // Fetch your JSON data and headers
  const jsonData = formData;
  var headers = columns.map((c) => c.header);

  console.log(jsonData[0]);
  console.log(headers);
  // Create a table element with Bootstrap classes
  const table = document.createElement('table');
  table.className = 'table table-bordered';
  
  // Add headers to the table with Bootstrap classes
  const headerRow = table.insertRow();
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.className = 'text-center';
    th.innerText = header;
    headerRow.appendChild(th);
  });

  // Add data rows to the table
  jsonData.forEach(async (dataItem, index) => {
    const row = table.insertRow();
    const values = Object.values(dataItem);

    for (let i = 0; i < values.length - 3; i++) {
      const cell = row.insertCell();
      if(isURL(values[i]))
      {
        const qrCom=createQr(values[i])
        cell.appendChild(qrCom)
        
       
      }
      else
      cell.innerText = values[i];
            // Apply styles to the cell
      cell.style.border = '1px solid black';
      cell.style.backgroundColor = index % 2 === 0 ? '#B8DAFF' : '#ffffff';
    }
  });

  document.body.appendChild(table);
  // Convert the table to a canvas using html2canvas
  setTimeout(async function(){ 

    const canvas = await html2canvas(table);

    // Convert the canvas to an image data URL
    const imageData = canvas.toDataURL('image/jpg');
    const image = new Image();
  
    image.onload = function () {
      const width = image.width;
      const height = image.height;
  
      console.log('Image Width:', width, 'px');
      console.log('Image Height:', height, 'px');
      const pdf = new jsPDF(width>height?'l':'p', 'px', [(width * 0.57) + 10, (height * 0.57) + 10]); // Create a new PDF instance
      // Add the image data to the PDF
      pdf.addImage(image, 'jpg', 10, 10, 0, 0);
  
      // Save the PDF
      pdf.save('output.pdf');
      document.body.removeChild(table)
    };
  
    image.src = imageData;


  }, 200);

};




  return (
    <div className="mt-4 mb-5">
     
     <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
        <Typography variant="h4"  gutterBottom>
         ردود الاستبيان
        </Typography>
      </Box>
      <Paper className="table-container ">
   
   <div >
   <MaterialReactTable ref={tableElem} columns={columns} data={formData} enableColumnFilterModes       enableRowSelection
 muiTableProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 0.2)',
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 0.2)',
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 0.2)',
        },
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
        >
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data Excel
          </Button>
      
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={generatePDF}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data PDF
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => generatePDFSelected(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Data PDF
          </Button>
      
      
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Data Excel
          </Button>
        </Box>
      )}
      />
   </div>
       
   
      </Paper>
    
    </div>
  );
};

export default FormData;
