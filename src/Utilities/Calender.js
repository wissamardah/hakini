import React, { useState } from "react";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { Container } from "react-bootstrap";

const Calender = ({selectedDateTime, setSelectedDateTime}) => {
    


  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
   
  };
  const handleAccept = () => {
    if (selectedDateTime) {
    }
  };
  const handleCancel = () => {
    
    setSelectedDateTime(null) 

};
  return (
  
   <div
        className=" border p-4  mb-4 rounded-3 fw-bold shadow-lg " 
        dir="ltr"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["StaticDateTimePicker"]}>
            <DemoItem >
            <StaticDateTimePicker
                value={selectedDateTime}
                componentsProps={{ actionBar: { actions: [] } }}

                onChange={handleDateTimeChange}
                onAccept={handleAccept}
                onCancel={handleCancel}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </div>
  )
}

export default Calender
