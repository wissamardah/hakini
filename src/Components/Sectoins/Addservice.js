import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

function AddService({setshowForm}) {
  const [header, setheader] = useState("");
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

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
          sectionId: 5,
          data: {
            image: imageUrl,
            body: body,
            header: header,
          },
        };

        try {
          const response = await axios.post(apiUrl, data, { headers });

          setBody("");
          setheader("");
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
          <Form.Label>اسم الخدمة </Form.Label>
          <Form.Control
            type="text"
            value={header}
            onChange={(e) => setheader(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="msg">
          <Form.Label>الوصف </Form.Label>
          <Form.Control
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="file">
          <Form.Label>اختار الصورة </Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button className="mt-3 w-25" variant="primary" type="submit">
          حفظ
        </Button>
       
      </div>
    </Form>
  );
}

export default AddService;
