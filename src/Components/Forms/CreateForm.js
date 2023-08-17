import axios from "axios";
import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import toastr from "toastr";

const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");
  const [inputs, setInputs] = useState([]);
  const [idCounter, setIdCounter] = useState(1); // Counter for generating unique IDs
  const [validated, setValidated] = useState(false);
  const [selectInput,setSelectInput] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubtextChange = (e) => {
    setSubtext(e.target.value);
  };

  const handleInputChange = (index, property, value) => {
    const updatedInputs = [...inputs];
    if (property === "options") {
      value = value.split(",");
    }
    updatedInputs[index][property] = value;
    setInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      { id: "input" + idCounter, label: "", type: "text" },
    ]);
    setIdCounter(idCounter + 1);
  };

  const handleRemoveInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleSubmit = (event) => {
       event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
     
      event.stopPropagation();
      setValidated(true);
      toastr.error("يرجى تعبئة جميع الحقول المطلوبة" ,event);
    } else {
      setValidated(true);
      const formStructure = {
        title,
        subtext,
        data: inputs.map((input) => {
          const { options, ...inputProps } = input;
          if (options) {
            inputProps.data = options;
          }
          return inputProps;
        }),
        activated: 1,
      };



  axios
        .post(process.env.REACT_APP_API_URL+"/api/createForm", formStructure, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          toastr.success("لقد قمة في اضافة استبيان جديد ");

          
          setTitle("");
          setSubtext("");
          setInputs([]);
          setIdCounter(1);
         
        })
        .catch((error) => {
          toastr.error("Error sending form data:", error);
        });
        


    
    }
  };
  

  return (
    <Container className="mt-5 border shadow-lg rounded-3 bg-create-form ">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between p-4 m-4 rounded-3 bg-light shadow-lg">
          <Form.Group className="" style={{ width: "45%" }} controlId="title">
            <Form.Label className=" text-bg-primary p-2 rounded-2 bg-opacity-75">
              العنوان
            </Form.Label>
            <Form.Control  
              className="shadow-sm"
              placeholder="ادخل العنوان"
              required
              type="text"
              value={title}
              onChange={handleTitleChange}
            />
              <Feedback  type="invalid" >
            يرجى إدخال ادخال العنوان

           </Feedback>
          </Form.Group>
          
          <Form.Group style={{ width: "45%" }} controlId="subtext">
            <Form.Label className=" text-bg-primary p-2 rounded-2 bg-opacity-75">
              النص الفرعي
            </Form.Label>
            <Form.Control
              className="shadow-sm"
              placeholder="ادخل النص الفرعي "
              required
              type="text"
              value={subtext}
              onChange={handleSubtextChange}
            />
              <Feedback  type="invalid" >
            يرجى إدخال النص الفرعي

           </Feedback>
          </Form.Group>
        
        </div>

        <hr className="mb-2"></hr>
        <div className="p-3 mb-3 mt-3 text-center ">
          <span className="mt-2 mb-2 fs-5 fw-bold shadow-lg text-dark text-center  p-2 rounded-2 bg-opacity-75 shadow-lg m-3">
            قم في اضافة الحقول المطلوبة{" "}
          </span>
        </div>
        {inputs.map((input, index) => (
          <div
            key={index}
            className="border-1 border rounded-3 p-4 m-3 bg-light shadow-lg"
          >
            <Row className="mb-2 d-flex   ">
              <Col xs="6" md="4">
                <Form.Label>نوع الحقل</Form.Label>
                <Form.Select
                  className=""
                  value={input.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="file">File</option>
                </Form.Select>
             
              </Col>
              <Col xs="6" md="5" className=" ">
                <Form.Label>اسم الحقل
                
                </Form.Label>
                <Form.Control  id="name"
                  required
                  type="text"
                  value={input.label}
                  onChange={(e) =>
                    handleInputChange(index, "label", e.target.value)
                  }
                  data-required="يرجى إدخال اسم الحقل"
                />
                <Feedback className="" type="invalid" >
            يرجى إدخال اسم الحقل
           </Feedback>
              </Col>
              
              <Col>
                {["text", "email", "password"].includes(input.type) && (
                  <Form.Group
                    controlId={`required-${input.id}`}
                    className="mt-4 "
                  >
                    <Form.Check
                      className="ms-md-5  p-2  form-check-inline"
                      label=" اجباري ؟"
                      type="checkbox"
                      checked={input.required || false}
                      onChange={(e) =>
                        handleInputChange(index, "required", e.target.checked)
                      }
                    />
                    
                  </Form.Group>
                )}
               
              </Col>
            </Row>

            {/* Additional Input Properties */}
            {["select", "radio"].includes(input.type) && (
              <Form.Group className="" controlId={`options-${input.id}`}>
                <Form.Label>الاختيارات</Form.Label>
                <Form.Control
                  type="text"
                  value={inputs[index]["options"]}
                  onChange={(e) =>{
                    
                    setSelectInput(e.target.value)
                    handleInputChange(index, "options", e.target.value)
                  }
                  }
                  placeholder="الخيار 1,  2,  3,........"
                />
              </Form.Group>
            )}

            {!["select", "radio", "checkbox", "file"].includes(input.type) && (
              <Form.Group controlId={`placeholder-${input.id}`}>
                <Form.Label>النص التعريفي</Form.Label>
                <Form.Control
                  placeholder="مثال على النص التعريفي"
                  type="text"
                  value={input.placeholder || ""}
                  onChange={(e) =>
                    handleInputChange(index, "placeholder", e.target.value)
                  }
                />
              </Form.Group>
            )}

            <div className="mb-3 mt-4">
              <Button
                className="w-25"
                variant="danger"
                onClick={() => handleRemoveInput(index)}
              >
                حذف الحقل
              </Button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between bg-light align-items-center m-3 mb-3 p-3 rounded-3 shadow-lg">
          <Button variant="primary" onClick={handleAddInput} className=" w-25">
            اضافة حقل جديد
          </Button>

          <Button   type="submit" className="w-25" variant="success">
            حفظ الاستبيان
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateForm;
