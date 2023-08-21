import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import user from "../image/user (3).png";
import lock from "../image/lock.png";
import avatar from "../image/password.png";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+"/api/adminlogin",
        {
          email,
          password,
        }
      );

      const { status, msg, token } = response.data;

      if (status === "success") {
        toastr.success("تم تسجيل الدخول  بنجاح");
        sessionStorage.setItem("token", token);
        navigate("/whatsapp");
      } else {
        toastr.error(msg, "خطأ");
      }
    } catch (error) {
      toastr.error("كلمة المرور او البريد الكتروني غير صحيح", "خطأ");
    }
    setIsLoading(false);
  };



  return (
    <Container className="mt-5 ">
      <div
        className=" border   m-auto border-2 shadow-lg rounded-3  text-end  "
        style={{ maxWidth: "550px" }}
      >
        <div className=" align-items-center d-grid justify-content-center">
          <h4 className="mt-5 text-center"> تسجيل الدخول</h4>

          <img width="160px" className="ms-2  mt-5  " src={avatar} />
        </div>

        <Form className="mt-5   p-3" onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label className="">Email</Form.Label>
            <div className="d-flex">
              <img className="ms-2 p-1" src={user} />
              <Form.Control
                className="shadow-lg"
                type="email"
                placeholder="ادخل الايميل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="d-flex ">
              <img className="ms-2 p-1" src={lock} />
              <Form.Control
                className="shadow-lg"
                type="password"
                placeholder="ادخل الرقم السري "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <Button
            className=" rounded-3 shadow-lg w-100 mt-5"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            تسجيل دخول
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
