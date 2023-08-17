import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Dialog, Paper } from "@mui/material";
import { Form, Button } from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import toastr from "toastr";
import { useLocation } from "react-router-dom";

const Campains  = () => {
  
  const location = useLocation();
  const [data, setData] = useState([]);
  const [showForm, setshowForm] = useState(false);
    const [name, setName] = useState("")
  const handleShowForm = () => {
    setshowForm(!showForm);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL+"/api/addCampain";
    const token = sessionStorage.getItem('token');

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    
   

    try {
      const response = await axios.post(url, {name}, { headers });
     
      setName("");
      toastr.success(" تم اضافة حملة جديده");
    } catch (error) {
      console.error(error);
    }
    setshowForm(false)
    fetchData()

  };

  const fetchData=async ()=>{
    axios
      .get(process.env.REACT_APP_API_URL+"/api/getCampains", {
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
  }
  useEffect(() => {
fetchData()
  }, []);

  const columns = [
    {
      id: "id",
      header: "رقم ",
      accessorKey: "id",
      Cell: ({ row }) => (
       
        <div className="text-end me-3 ">
      
          {row.original.id}
        
        </div>
      ),
    },
    {
      id: "name",
      header: "اسم الحملة",
      accessorKey: "name",
      Cell: ({ row }) => (
        <div className="text-end ">
       
          {row.original.name}
    
        </div>
      ),
    },
    {
      id: "delete",
      header:"",
      accessorKey: "delete",
      Cell: ({ row }) => {
       
        const handleDelete = async () => {
          const dataId = row.original.id; // Assuming there's an "id" property in the form data
          const token = sessionStorage.getItem("token");
          try{
  await axios.get(process.env.REACT_APP_API_URL+`/api/deleteCampain/`+dataId, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        
  
          }
          catch{
  
          }
          fetchData()

        };
      
        return (
          <div className="text-end fw-bolder">
  
  
  
           
           <button type="button" class="btn btn-danger" onClick={handleDelete}>حذف</button>
  
          </div>
        );},
    }
  ];


  return (
    <Container className=" mt-5">
   
     {location.pathname === "/campains"&& <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          </div>}
     
          {showForm && (
        <Form className=" border p-3 rounded-4 w-50  mb-4  m-auto shadow-lg " onSubmit={handleSubmit}>
      <div className=" text-center py-4">
        <span className=" fs-6    bg-primary text-light p-2 rounded-2 ">
          {" "}
          اضافة  حملة{" "}
        </span>
      </div>
      <div className="w-100 d-flex justify-content-center">
        <Form.Group className="w-50 me-3" controlId="name">
          <Form.Label>name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        
      </div>
      <Button className="w-25 mt-3 me-3" variant="primary" type="submit">
        حفظ
      </Button>
    </Form>
     )

     }
      <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
        <Typography variant="h4"  gutterBottom>
          قائمة الحملات
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

export default Campains ;
