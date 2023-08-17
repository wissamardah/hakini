import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Dialog, Paper } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import toastr from "toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";


const Scheduledmessages = () => {
    const [data, setData] = useState([]);
    const { id } = useParams();
  
    useEffect(() => {
      axios
        .get(process.env.REACT_APP_API_URL+"/api/getscheduledmessagesMobile", {
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
  const formatDateTime = (datetime) => {
      const date = new Date(datetime);

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
    
      const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(date);
    
      return formattedDateTime;
    };
    const handleDelete = async (id) => {
      const confirmed = window.confirm("هل انت متاكد من حذف العنصر");
  
      if (confirmed) {
        try {
          // ... your existing code for deleting the item ...
  
          const response = await axios.get(
            process.env.REACT_APP_API_URL+`/api/deletescheduledmessagesMobile/${id}`,
             {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          );
          const result = response.data;
  
          if (result.status === "success") {
            toastr.success("تم حذف العنصر");
  
            const updatedData = data.filter((item) => item.id !== id);
            setData(updatedData);
          } else {
            console.error("Error:", result);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    const columns = [
     
      {
        id: "message",
        header: "الرسالة",
        accessorKey: "message",
        Cell: ({ row }) => (
          <div className="text-end ">
         
            {row.original.message}
       
          </div>
        ),
      },
      {
        id: "mobiles",
        header: " عدد الارقام ",
        accessorKey: "mobiles",
        Cell: ({ row }) => (
          <div className="text-end me-4 ">
            {row.original.mobiles.length}
            
          </div>
        ),
      },
      {
        id: "messageType",
        header: "طريقة الارسال",
        accessorKey: "messageType",
        Cell: ({ row }) => (
          <div className="text-end ">
         {row.original.messageType}
         
          </div>
        ),
      },
      {
        id: "datetime",
        header: <div className="k"> التاريخ </div>,
        accessorKey: "datetime",
        Cell: ({ row }) => (
          <div className="text-end ">
        
            {formatDateTime(row.original.datetime)}
       
          </div>
        ),
      },
     { id: "id",
      header: <div className="k"> حذف </div>,
      accessorKey: "id",
      Cell: ({ row }) => (
        <div className=" text-end me-2 ">
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color: "#885bf1", cursor: "pointer" }}
          onClick={() => handleDelete(row.original.id)}
        />
      </div>
      ),
    },
    ];
  
  
  
    return (
      <Container className="text-center mt-5">
        <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
          <Typography variant="h4"  gutterBottom>
          الرسائل المجدولة 
          </Typography>
        </Box>
        <Paper className="table-container ">
          <div   >
            <MaterialReactTable columns={columns} data={data} enableColumnFilterModes />
          </div>
        </Paper>
      </Container>
    );
 
}

export default Scheduledmessages
