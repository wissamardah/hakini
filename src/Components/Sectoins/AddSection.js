import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

function AddQ_A({setshowForm}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.REACT_APP_API_URL+"/api/editSection";
    const token = sessionStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const data = {
      sectionId: 11,
      data: {
        question,
        answer,
      },
    };

    try {
      const response = await axios.post(url, data, { headers });
      setQuestion("");
      setAnswer("");
      toastr.success("تم اضافة عنصر جديد");
    } catch (error) {
      console.error(error);
    }
    setshowForm(false)
  };

  return (
    <Form className=" border p-3 rounded-4 shadow-lg " onSubmit={handleSubmit}>
      <div className=" text-center py-4">
        <span className=" fs-6    bg-primary text-light p-2 rounded-2 ">
          {" "}
          اضافة سؤال وجواب{" "}
        </span>
      </div>
      <div className="w-100 d-flex justify-content-between">
        <Form.Group className="w-50 me-3" controlId="question">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="w-50 me-3" controlId="answer">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Group>
      </div>
      <Button className="w-25 mt-3 me-3" variant="primary" type="submit">
        حفظ
      </Button>
    </Form>
  );
}

export default AddQ_A;
