import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Dialog, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import toastr from "toastr";

const CustomerData = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [activeId, setActiveId] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL+"/api/getCustomers", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const makePostRequest = async (newData) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL+"/api/customerNote", { note: newData,id:activeId }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      toastr.success("Successfully updated notes.");
      fetchData();

    } catch (error) {
      console.error("Error:", error);
      toastr.error("Failed to update notes.");
    }
  };

  const handleDoubleClick = (notes,id) => {
    setIsEditing(true);
    setEditedText(notes);
    setActiveId(id)
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    makePostRequest(editedText);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
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
      header: "الاسم",
      accessorKey: "name",
      Cell: ({ row }) => (
        <div className="text-end ">
       
          {row.original.name}
    
        </div>
      ),
    },
    {
      id: "mobile",
      header: "رقم الهاتف",
      accessorKey: "mobile",
      Cell: ({ row }) => (
        <div className="text-end ">
                      <Link target="_blank" className="text-decoration-none" to={process.env.REACT_APP_ADMIN_URL+"/whatsapp?mobile="+row.original.mobile}>

          {row.original.mobile}
     </Link>
        </div>
      ),
    },
    {
      id: "address",
      header: "عنوان الزبون",
      accessorKey: "address",
      Cell: ({ row }) => (
        <div className="text-end  ">
        {row.original.address}
        </div>
      ),
    },
    {
      id: "gender",
      header: <div className="k">  الجنس </div>,
      accessorKey: "gender",
      Cell: ({ row }) => (
        <div className="text-end ">
      
          {row.original.gender}
      
        </div>
      ),
    },{
        id: "email",
        header: <div className="me-5">  البريد الالكتروني </div>,
        accessorKey: "email",
        Cell: ({ row }) => (
          <div className="text-end  ms-5 ">
        
            {row.original.email}
        
          </div>
        ),
      },
      {
        id: "dob",
        header: <div className="k"> تاريخ الميلاد </div>,
        accessorKey: "dob",
        Cell: ({ row }) => (
          <div className="text-end ">
        
            {row.original.dob}
        
          </div>
        ),
      },
      {
        id: "isSale",
        header: <div className="k">زبون حقيقي؟</div>,
        accessorKey: "isSale",
        Cell: ({ row }) => {
       
        
          return (
            <div className="text-end fw-bolder">
              <input
                type="checkbox"
                checked={row.original.isSale}
               
                disabled
              />
             
            </div>
          );},
      },

      {
        id: "notes",
        header: "ملاحظات",
        accessorKey: "notes",
        Cell: ({ row }) => (
          (isEditing && activeId==row.original.id) ? (
            <div className="text-end">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            
            <div style={{marginTop:"10px"}}>
                 <button type="button" class="btn btn-success" style={{marginLeft:"5px"}} onClick={handleSaveChanges}>حفظ</button>
              <button type="button" class="btn btn-danger" style={{marginRight:"5px"}} onClick={handleCancelEdit}>الغاء</button>

              </div>
           
            </div>
          ) : (
            <div className="text-end" onDoubleClick={() => handleDoubleClick(row.original.notes,row.original.id)}>
              {row.original.notes||"لا ملاحظات"}
            </div>
          )
        ),
      },
      {
        id: "deletecustomer",
        header:"حذف",
        accessorKey: "deletecustomer",
        Cell: ({ row }) => {
         
          const handleDelete = async () => {
            const dataId = row.original.id; // Assuming there's an "id" property in the form data
            const token = sessionStorage.getItem("token");
            try{
    await axios.get(process.env.REACT_APP_API_URL+`/api/deletecustomer/`+dataId, {
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
      }
  ];


  return (
    <Container className="text-center mt-5">
      <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
        <Typography variant="h4" gutterBottom>
          قائمة الزبائن
        </Typography>
      </Box>
      <Paper className="table-container ">
        <div>
          <MaterialReactTable columns={columns} data={data} enableColumnFilterModes />
        </div>
      </Paper>
    </Container>
  );
};

export default CustomerData;
