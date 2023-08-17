import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

function Addblog({ setshowForm }) {
  const [uploadedImages, setUploadedImages] = useState([]);

  const [editedData, setEditedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+"/api/editSection",
        {
          sectionId: 7,
          data: {
            image1: uploadedImages.image1 || editedData.data.image1,
            image2: uploadedImages.image2 || editedData.data.image2,
            image3: uploadedImages.image3 || editedData.data.image3,
            image4: uploadedImages.image3 || editedData.data.image4,
            image5: uploadedImages.image3 || editedData.data.image5,
            image6: uploadedImages.image3 || editedData.data.image6,
            image7: uploadedImages.image3 || editedData.data.image7,
          },
        },
        { headers }
      );

      // Handle the API response here, e.g., show a success message

      // Reset the form and exit edit mode
      setEditedData({});
      setUploadedImages({});
      
    } catch (error) {
      // Handle errors here, e.g., show an error message
      toastr.error("يجب اضافة سبع صور")
      
    }
    setshowForm(false)
  };

  const handleImageUpload = async (file, key) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+"/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Store the uploaded image URL in the state
      setUploadedImages((prevImages) => ({
        ...prevImages,
        [key]: response.data.url,
      }));
    } catch (error) {
      // Handle errors here, e.g., show an error message
      console.error(error);
    }
  };
  const handleEditClick2 = (item) => {
    setEditedData({
      sectionId: 7,
      data: {
        image1: item.data.image1,
        image2: item.data.image2,
        image3: item.data.image3,
        image4: item.data.image3,
        image5: item.data.image3,
        image6: item.data.image3,
        image7: item.data.image3,
      },
    });

    
  };

  return (
    <Form className="border p-4 shadow-lg rounded-4" onSubmit={handleSubmit}>
      {Array.from({ length: 7 }).map((_, index) => (
        <Form.Group className="mb-3" key={index}>
          <Form.Label>الصورة {index + 1}</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) =>
              handleImageUpload(e.target.files[0], `image${index + 1}`)
            }
          />
        </Form.Group>
      ))}
      <Button
        className="mt-4 w-25"
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        حفظ
      </Button>
    </Form>
  );
}

export default Addblog;
