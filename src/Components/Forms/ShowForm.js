import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import FormData from "./FormData";
import copyicon from '../../image/copy.png';
import toastr from "toastr";

const ShowForm = () => {
  const { id } = useParams();
  const [formDetails, setFormDetails] = useState(null);
  const [_formDetails, _setFormDetails] = useState(null);
  const [campain, setCampain] = useState(0);
  const [platform, setPlatform] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL+`/api/getForm/${id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const result = response.data;

        if (result.status === "success") {

          console.log(result.data[0].data)
          setFormDetails(result.data[0]);
          _setFormDetails(result.data[0].data);
        } else {
          console.error("Error:", result);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container className="">
      <h4 className="mt-5 fw-bold mb-4">تفاصيل الاستبيان</h4>
      {formDetails ? (
        <div className="border p-2 border-light rounded-3 input-shwo-form">
          <div className="d-flex  overflow-hidden justify-content-between  input-shw-form">
            <input
              className=" "
              type="text"
              value={formDetails.title}
              readOnly
              style={{ minWidth: "255px" }}
            />

            <input
              className=" w-25 me-1"
              type="text"
              value={formDetails.dateadded.slice(0, 10)}
              readOnly
            />
            <input
              className=" w-25 me-1"
              type="text"
              value={formDetails.activated === 1 ? "نشط" : "غير نشط"}
              readOnly
            />
          </div>
          <div className="d-flex  overflow-hidden justify-content-between  input-shw-form" style={{marginTop:"20px"}}>
            <div
            
            style={{
              flexDirection:"row",
              display:"flex"
            }}
            >
<div className="form-field" style={{marginLeft:"auto",marginRight:"20px"}}>
                <label className="form-label fw-bold" style={{color:"#fff"}}>الحملة</label>
                <select
                  className="form-select"
                  onChange={(event) => {
                    setCampain(event.target.value)
                  }}
                >
                  <option key={`def`} value={null}>
                    الحملة
                  </option>
                  {data.map((option, index) => (
                    <option key={`campain_${index}`} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field" style={{marginLeft:"auto",marginRight:"20px"}}>
                <label className="form-label fw-bold" style={{color:"#fff"}}>المنصة</label>
                <select
                  className="form-select"
                  onChange={(event) => {
                    setPlatform(event.target.value)
                  }}
                >
                  <option key={`def`} value={null}>
                    المنصة
                  </option>
                  <option key={`platform_facebook`} value={"facebook"}>
                    facebook
                  </option>
                  <option key={`platform_Instagram`} value={"Instagram"}>
                    Instagram
                  </option>
                  <option key={`platform_Other`} value={"Other"}>
                    Other
                  </option>
                </select>
            </div>
            <img
            onClick={() => {
              
              navigator.clipboard.writeText(process.env.REACT_APP_URL+`/form?campain=`+campain+"&platform="+platform+"&formId="+id)
            
              toastr.success("تم نسخ رابط النموذج");

            }}

            src={copyicon} 
            
            style={{
              width:"40px",
              height:"40px",
              marginTop:"auto",
              marginRight:"20px",
              cursor:"pointer"
            }}/>

            </div>
              
              
          </div>
       
          <div className="d-flex  overflow-hidden justify-content-between  input-shw-form" style={{marginTop:"20px"}}>
          
            <div className="form-field" style={{width:"100%",marginLeft:"auto"}}>
              

            </div>
          </div>
        </div>
      ) : null}
      <h4 className="mt-5 fw-bold">حقول الاستبيان</h4>
      {formDetails && _formDetails && (
        <Row className="    d-flex align-items-center input-shwo-form border mt-4  input-shw-form  shadow-lg rounded-3">
          {_formDetails.map((data, index) => (
            <Col className="d-flex   p-3" md="6" xs="12" key={index}>
              <div className="  d-grid w-100 ">
                <label className="p-2 fs-5 fw-bold text-light">
                  {data.label == "" ? "لايوجد" : <label>{data.label}</label>}
                </label>
                <input
                  className="  rounded-2 shadow-lg"
                  type={data.type === "file" ? "" : "text"}
                  value={data.type}
                  readOnly
                />
              </div>
            </Col>
          ))}
        </Row>
      )}

      <h4 className="mt-5 fw-bold">
        {" "}
        المعلومات المعبئة داخل الاستبيان من قبل الزوار
      </h4>
      {formDetails && _formDetails && (
        <FormData id={id} _formDetails={_formDetails} />
      )}
    </Container>
  );
};

export default ShowForm;
