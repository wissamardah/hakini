import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Dialog, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import toastr from "toastr";

const DisplayAllForms = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+"/api/getForms", {
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

  const columns = [
    {
      id: "id",
      header: "رقم الاستبيانة",
    
      accessorKey: "id",
      Cell: ({ row }) => (
       
        <div className="text-end me-3 ">
        <Link
          className="text-decoration-none text-dark"
          to={`/form/${row.original.id}`}
        >
          {row.original.id}
        </Link>
        </div>
      ),
    },
    {
      id: "title",
      header: "العنوان",
      accessorKey: "title",
      Cell: ({ row }) => (
        <div className="text-end ">
        <Link
          className="text-decoration-none  text-dark"
          to={`/form/${row.original.id}`}
        >
          {row.original.title}
        </Link>
        </div>
      ),
    },
    {
      id: "subtext",
      header: "النص",
      accessorKey: "subtext",
      Cell: ({ row }) => (
        <div className="text-end ">
        <Link
          className="text-decoration-none  text-dark"
          to={`/form/${row.original.id}`}
        >
          {row.original.subtext}
        </Link>
        </div>
      ),
    },
    {
      id: "activated",
      header: "تنشيط",
      accessorKey: "activated",
      Cell: ({ row }) => (
        <div className="text-end me-3 ">
        <input
        className=""
          type="checkbox"
          checked={row.original.activated === 1}
          onChange={() => handleCheckboxChange(row.original.id)}
        />
        </div>
      ),
    },
    {
      id: "dateadded",
      header: <div className="k"> تاريخ الانشاء </div>,
      accessorKey: "dateadded",
      Cell: ({ row }) => (
        <div className="text-end ">
       <Link
          className="text-decoration-none  text-dark"
          to={`/form/${row.original.id}`}
        >
          {row.original.dateadded.slice(0, 10)}
        </Link>
        </div>
      ),
    },
  ];

  const handleCheckboxChange = (itemId) => {
    const updatedData = data.map((item) => {
      if (item.id === itemId) {
        const newActivated = item.activated === 1 ? 0 : 1;
        item.activated = newActivated;
        const endpoint = newActivated ? "activateform" : "deactivateform";
        axios
          .post(
            process.env.REACT_APP_API_URL+`/api/${endpoint}`,
            { formid: itemId },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            toastr.success(response.data.msg);
          })
          .catch((error) => {
            toastr.error("Error:", error);
          });
      }
      return item;
    });
    setData(updatedData);
  };

  return (
    <Container className="text-center mt-5">
      <Box py={2} bgcolor="primary.main" color="primary.contrastText" textAlign="center">
        <Typography variant="h4"  gutterBottom>
          قائمة الاستبيانات
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

export default DisplayAllForms;
