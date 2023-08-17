import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Dialog, Paper } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import toastr from "toastr";

const ResQuestion = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+`/api/questionResponses/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const result = response.data;
        setData(result.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
 // Function to format the timestamp as a date and time in Palestine time
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
  
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Hebron",
    };
  
    const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(date);
  
    return formattedDateTime;
  };
  
  const columns = [
   
    {
      id: "name",
      header: "الاسم",
      accessorKey: "name",
      Cell: ({ row }) => (
        <div className="text-end ">
       
          {row.original.name}
     
        </div>
      ),
    },
    {
      id: "phone",
      header: "رقم الهاتف",
      accessorKey: "phone",
      Cell: ({ row }) => (
        <div className="text-end ">
     <Link target="-blank" className="text-decoration-none" to={process.env.REACT_APP_ADMIN_URL+"/whatsapp?mobile="+row.original.phone}>
          {row.original.phone}
          </Link>
        </div>
      ),
    },
    {
      id: "sent",
      header: "ارسال",
      accessorKey: "sent",
      Cell: ({ row }) => (
        <div className="text-end ">
       {row.original.sent === 0 ? 'مستقبل' : "مرسل"}
       
        </div>
      ),
    },
    {
      id: "status",
      header: <div className="k">  حالة الرسالة </div>,
      accessorKey: "status",
      Cell: ({ row }) => (
        <div className="text-end ">
      
          {row.original.status}
     
        </div>
      ),
    },
    {
        id: "timestamp",
        header: <div className="k"> التاريخ  </div>,
        accessorKey: "timestamp",
        Cell: ({ row }) => (
            
          <div className="text-end ">
        
            {formatDateTime(row.original.timestamp)}
       
          </div>
        ),
      },
  ];



  return (
    <Container className="text-center mt-5">
      <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
        <Typography variant="h4"  gutterBottom>
         اجابات الاسئلة
        </Typography>
      </Box>
      <Paper className="table-container ">
        <div   >
          <MaterialReactTable columns={columns} data={data} enableColumnFilterModes />
        </div>
      </Paper>
    </Container>
  );
};

export default ResQuestion;
