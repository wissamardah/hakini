import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

function AddWhatSay({setshowForm}) {
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [starNumber, setStarNumber] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadUrl = process.env.REACT_APP_API_URL+"/api/upload";
    const apiUrl = process.env.REACT_APP_API_URL+"/api/editSection";
    const token = sessionStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axios.post(uploadUrl, formData);
        const imageUrl = uploadResponse.data.url;
        setUploadedImageUrl(imageUrl);

        const data = {
          sectionId: 10,
          data: {
            msg,
            image: imageUrl,
            Name: name,
            starNumber,
          },
        };

        try {
          const response = await axios.post(apiUrl, data, { headers });

          setMsg("");
          setName("");
          setStarNumber(0);
          setSelectedFile(null);
          toastr.success("تم اضافة عنصر جديد");
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  setshowForm(false)
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className=" border p-4 rounded-4 shadow-lg border-1 ">
        <Form.Group controlId="name">
          <Form.Label>الاسم</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="msg">
          <Form.Label>ماذا قالو</Form.Label>
          <Form.Control
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="starNumber">
          <Form.Label>  عدد النجوم</Form.Label>
          <Form.Control
         
          min={1}
          max={5}
            type="number"
            value={starNumber}
            onChange={(e) => {
      const value = parseInt(e.target.value);
      if (value >= 1 && value <= 5) {
        setStarNumber(value);
      }
    }}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>اختار الصورة </Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button className="mt-3 w-25" variant="primary" type="submit"  >
          حفظ
        </Button>
      </div>
    </Form>
  );
}

export default AddWhatSay;
