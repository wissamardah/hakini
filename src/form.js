import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Form.css';  // Import the CSS file here
import axios from 'axios';


function Form() {
  const queryParams = new URLSearchParams(window.location.search)
  const [jsonData, setJsonData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formValues, setFormValues] = useState({});
  const [countryCode,setCountryCode]=useState("972")
  const [mobile,setMobile]=useState("")
  useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/getForm/'+queryParams.get("formId"));
        setJsonData(response.data);
      // Creating initial state with all fields set to null
      const initialState = response.data.data[0].data.reduce((acc, field) => {
        if(field.id=="platform")
        acc[field.id] = queryParams.get(field.id);

        else if(field.id=="campain")
{
  acc[field.id] = parseInt(queryParams.get(field.id));

}
        else if(field.id=="isSale")
        acc[field.id] = false;

        else if(field.type=="checkbox")
        acc[field.id] = false;

        else 
        acc[field.id] = null;

        return acc;
    }, {});

        setFormValues(initialState);
    };

    fetchData();
}, []);
const handleFileChange = async (event) => {
  setIsUploading(true);
  const file = event.target.files[0];

  // Use FormData to prepare the file for upload
  const formData = new FormData();
  formData.append('file', file);

  try {
      // Upload the file and get the URL
      const response = await axios.post(process.env.REACT_APP_API_URL+'/api/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      // Store the URL in the form values
      setFormValues({
          ...formValues,
          [event.target.name]: response.data.url,
      });
  } catch (error) {
      console.error('Failed to upload file:', error);
  }
  setIsUploading(false);
};
  const handleChange = (event) => {
      if (event.target.name === 'mobileNumber') {
        setMobile(event.target.value)

          setFormValues({
              ...formValues,
              mobile: countryCode + event.target.value,
          });
      }
      else if(event.target.name === 'countryCode' ){
        setCountryCode(event.target.value)
        setFormValues({
          ...formValues,
          mobile: event.target.value + mobile,
      });
      }
      else {
          setFormValues({
              ...formValues,
              [event.target.name]: event.target.value,
          });
      }
  };

    const handleCheckboxChange = (event) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      // Add your form id and data to the body of the POST request
      const data = {
          formid: jsonData.data[0].id,
          data: formValues
      };
   

      try {
          // Send the POST request to the specified endpoint
          const response= await axios.post(process.env.REACT_APP_API_URL+'/api/sendform', data);

      
          // Clear the form
          window.location.reload()

      } catch (error) {
          // Handle the error
          console.error('Failed to submit form:', error);
      }
  };

    return jsonData ?(
      <div className="container" style={{
        paddingTop:"50px",
        paddingBottom:"70px"
      }}>
        <div className="card">
                <div className="card-body">
      <h1 className="text-center fw-bold mb-3">{jsonData.data[0].title}</h1>
      <p className="text-center text-muted mb-5">{jsonData.data[0].subtext}</p>
     
        <form onSubmit={handleSubmit} className="container">
            <div className="row">
                {jsonData.data[0].data.map((field) => {
                    if (field.id === 'mobile') {
                      return (
                          <div className="col-lg-6 mb-3" key={field.id}>
                              <div className="form-field">
                                  <label className="form-label fw-bold">{field.label}</label>
                                  <div className="input-group">
                                 
                                      <div className="col-9">
                                          <input
                                              className="form-control"
                                              type="text"
                                              name="mobileNumber"
                                              onChange={handleChange}
                                              required={field.required}
                                              placeholder={field.placeholder}
                                          />
                                      </div>
                                      <div className="col-3">
                                          <select
                                              className="form-select"
                                              name="countryCode"
                                              onChange={handleChange}
                                          >
                                              <option value="972">972</option>
                                              <option value="970">970</option>
                                          </select>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  }
                  else if(field.id==="campain"||field.id==="platform"){
               
                      return (
                        <div className="col-lg-6 mb-3" key={field.id}>
                            <div className="form-field">
                                <label className="form-label fw-bold" hidden>{field.label}</label>
                                <input
                                    className="form-control"
                                    type={field.type}
                                    name={field.id}
                                    value={queryParams.get(field.id)}
                                    onChange={handleChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    hidden
                                />
                            </div>
                        </div>
                    );

                    
                  }
                  else if(field.id==="isSale"){
                    return (
                      <div className="col-lg-6 mb-3" key={field.id}>
                          <div className="form-check d-flex flex-row">
                              <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={field.id}
                                  name={field.id}
                                  value={false}
                                  onChange={handleCheckboxChange}
                                  hidden
                              />
                              <label className="form-check-label fw-bold" hidden htmlFor={field.id}>
                                  {field.label}
                              </label>
                          </div>
                      </div>
                  );
                  }
                  else if (field.type === 'file') {
                    return (
                        <div className="col-lg-6 mb-3" key={field.id}>
                            <div className="form-field">
                                <label className="form-label fw-bold">{field.label}</label>
                                <input
                                    className="form-control"
                                    type={field.type}
                                    name={field.id}
                                    onChange={handleFileChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        </div>
                    );
                } 
                    switch (field.type) {
                        case "text":
                        case "email":
                        case "password":
                        case "date":
                            return (
                                <div className="col-lg-6 mb-3" key={field.id}>
                                    <div className="form-field">
                                        <label className="form-label fw-bold">{field.label}</label>
                                        <input
                                            className="form-control"
                                            type={field.type}
                                            name={field.id}
                                            onChange={handleChange}
                                            required={field.required}
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                </div>
                            );
                        case "radio":
                          return (
                            <div className="col-lg-6 mb-3 text-right" key={field.id}>
                                <label className="form-label fw-bold">{field.label}</label>
                                {field.data.map((option, index) => (
                                    <div className="form-check d-flex flex-row" key={`${field.id}_${index}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id={`${field.id}_${index}`}
                                            name={field.id}
                                            value={option}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor={`${field.id}_${index}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        );
                        case "checkbox":
                            return (
                                <div className="col-lg-6 mb-3" key={field.id}>
                                    <div className="form-check d-flex flex-row">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={field.id}
                                            name={field.id}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor={field.id}>
                                            {field.label}
                                        </label>
                                    </div>
                                </div>
                            );
                        case "textarea":
                            return (
                                <div className="col-lg-6 mb-3" key={field.id}>
                                    <div className="form-field">
                                        <label className="form-label fw-bold">{field.label}</label>
                                        <textarea
                                            className="form-control"
                                            id={field.id}
                                            name={field.id}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                </div>
                            );
                        case "select":
                            return (
                                <div className="col-lg-6 mb-3" key={field.id}>
                                    <div className="form-field">
                                        <label className="form-label fw-bold">{field.label}</label>
                                        <select className="form-select" id={field.id} name={field.id} onChange={handleChange}>
                                        <option key={`def`} value={null}>
                                                    اختر
                                                </option>
                                            {field.data.map((option, index) => (
                                                <option key={`${field.id}_${index}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        case "file":
                            return (
                                <div className="col-lg-6 mb-3" key={field.id}>
                                    <div className="form-field">
                                        <label className="form-label fw-bold">{field.label}</label>
                                        <input
                                            className="form-control"
                                            type={field.type}
                                            id={field.id}
                                            name={field.id}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
            <div className="d-grid gap-2">
            <button type="submit" style={{width:"70%",marginLeft:"auto",marginRight:"auto"}} className="btn btn-primary mt-3" disabled={isUploading}>{isUploading?"جار رفع الملف":"ارسال"}</button>
                        </div>
        </form>
        </div>
        </div>
        </div>
    ):(
      <p>Loading form...</p>
  );;
}

export default Form;
