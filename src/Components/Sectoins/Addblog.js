import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

function Addblog({setshowForm}) {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
          sectionId: 9,
          data: {
            title,
            image: imageUrl,
            longDescription,
            desc,
          },
        };

        try {
          const response = await axios.post(apiUrl, data, { headers });

          toastr.success("تم اضافة مدونة جديدة");
          setTitle("");
          setSelectedFile(null);
          setUploadedImageUrl("");
          setLongDescription("");
          setDesc("");
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setshowForm(false)
    setIsLoading(false);

  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Form className="border p-4 shadow-lg rounded-4" onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>العنوان</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="file">
        <Form.Label>اختار الصوره</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Form.Group controlId="longDescription">
        <Form.Label>التفاصيل</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="desc">
        <Form.Label>الوصف</Form.Label>
        <Form.Control
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </Form.Group>
      <Button className="mt-4 w-25" variant="primary" type="submit"  disabled={isLoading}>
        حفظ
      </Button>
     
    </Form>
  );
}

export default Addblog;
