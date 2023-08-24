import React, { useState } from "react";
import "./modal.css";
import close from "../../src/image/close.svg";

const AddNewContactmodal = ({ isOpen, onClose, fetchNames }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  if (!isOpen) {
    return null;  
  }

  const sendMessage = async (event) => {
    event.preventDefault();
    
    if (phoneNumber !== "") {
      const response = await fetch("http://localhost:3001/api/createNewContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: "",
          timestamp: Math.floor(Date.now() / 1000),
        }),
      });
  
      if (response) {
        onClose();
      }
    }
  };
  

  return (
    <div className="modal">
      <div className="">
        <button className="close-modal" onClick={onClose}>
          <img src={close} />
        </button>
        <h3>اضف جهة اتصال</h3>
        <form onSubmit={sendMessage} dir="ltr">
          <input
            placeholder="+123 123456789"
            type="number"
            onChange={(e) => {
                setPhoneNumber(e.target.value)
            }}
          />
          <button type="submit">اضافة</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewContactmodal;
