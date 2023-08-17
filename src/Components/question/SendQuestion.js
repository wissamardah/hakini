import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Calender from "../../Utilities/Calender";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import JsonComponent from './FilterMobiles';
import dayjs from "dayjs";
import toastr from "toastr";
import utc from 'dayjs/plugin/utc'; // Make sure to import the UTC plugin
dayjs.extend(utc)


const SendQuestion = () => {
  const [question, setQuestion] = useState("");
  const [platform, setPlatform] = useState("");
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [sending, setSending] = useState(false);

  const [data, setData] = useState([]);

  const handleChange = (event) => {
    const selectedQuestion = event.target.value;
    setQuestion(selectedQuestion);
  };
  const handleChangePlatform = (event) => {
    const selectedPlatform = event.target.value;
    setPlatform(selectedPlatform);
  };
 
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+"/api/questions", {
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


      axios
      .get(process.env.REACT_APP_API_URL+"/api/getAllFormData", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const result = response.data;
        setJsonData(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);


  function handleSubmit(){
    setSending(true)
    const selectedDateTimeUTC = selectedDateTime.utc().format();


     const postData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/api/addScheduledMessageMobile', {
          method: 'POST', // specify the method
          headers: {
            'Content-Type': 'application/json', // specify the Content-Type header
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,

          },
          body: JSON.stringify({
            "messageDate": selectedDateTimeUTC,
            "message":question,
            "mobiles":filteredMobiles,
            "messageType":platform
           }) // body should be a JSON string
        });
        setSending(false)
        // Check if request is successful
        if (response.ok) {
          const jsonResponse = await response.json(); // parse the JSON response if needed

          toastr.success(jsonResponse.msg);

        } else {
          toastr.error('Network response was not ok');

          throw new Error('Network response was not ok');
        }
    
      } catch (error) {
        toastr.error('There has been a problem with your fetch operation: ', error);

        console.error('There has been a problem with your fetch operation: ', error);
      }
    };
    
    postData()
  }


  return (
    <Container className=" mt-5 ">
         {jsonData&&(
 <JsonComponent data={jsonData} setFilteredMobiles={setFilteredMobiles}/>

         )}  

      <Row>
        <Col xs="12" lg="6">
          <Calender selectedDateTime={selectedDateTime} setSelectedDateTime={setSelectedDateTime}/>
        </Col>
        <Col xs="12" lg="6" >
          <div className="border p-4   mt- rounded-3 fw-bold shadow-lg mb-4 ">
            <FormControl className="" fullWidth>
              <InputLabel id="demo-simple-select-label">السؤال</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={question}
                className=" "
                label="السؤال"
                onChange={handleChange}
              >
                {data.length >= 1 ? (
                  data.map((item, index) => (
                    <MenuItem key={index} value={item.question}>
                      {item.question}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            

              
            </FormControl>
            <FormControl fullWidth className=" mt-3">
              <InputLabel className="text-center" id="demo-simple">طريقة الارسال</InputLabel>
            <Select className=""
                labelId="demo-simple"
                id="demo-simple-select"
                value={platform}
                label="طريقة الارسال"
                onChange={handleChangePlatform}
              >
                <MenuItem value='whatsapp'>whatsapp</MenuItem>
                <MenuItem value='sms'>sms</MenuItem>
              </Select>
              </FormControl>

                  <div
                  style={{
                    marginTop:"50px"
                  }}
                  >
                       <h4>سيتم ارسال السؤال "{question}" الى {filteredMobiles.length} رقم هاتف عبر {platform} في {selectedDateTime.format('YYYY-MM-DD')} الساعة {selectedDateTime.format('hh:mm A')}</h4>
             
             <br/>
              <h4>هل أنت متأكد؟</h4> 
              <button 
              disabled={sending}
                          onClick={() => handleSubmit()}

            className={`btn m-2 btn-primary`} 
          >
        جدولة الإرسال
          </button>

                  </div>
          

          </div>
          
        </Col>
      </Row>
    </Container>
  );
};

export default SendQuestion;
