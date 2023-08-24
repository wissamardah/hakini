import React, { useEffect, useState, useRef } from "react";
import "./ChatScreen.css";
import ChatComponent from "./ChatComponent";
import AddNewContactmodal from "./models/AddNewContactmodal";
import plus from "../src/image/plus.svg";

const ChatScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [names, setNames] = useState([]);
  const [phone, setPhone] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchNames = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL+"/api/getWhatsappNames",
        {

          headers: new Headers({
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }), 
        }
      );
      const data = await response.json();
      setNames(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);

      console.error("Error fetching names:", error);
    }
  };

  useEffect(() => {
    fetchNames();
    const interval = setInterval(fetchNames, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="chatlist">
      <div className="chat-menu">
        <button className="new-contact" onClick={handleOpenModal}><img src={plus}/></button>

        <ul>
          {names &&
            names.map((name, index) => (
              <li className="chat-cell" onClick={()=>{setPhone(name.phone)}} key={index}>
                <div className="chat-cell-l">
                  <p>{name.name}</p>
                  <p className="chat-cell-message">{name.message}</p>
                </div>
                <div className="chat-cell-r">
                  <small>{new Date(parseInt(name.timestamp * 1000)).toLocaleString(undefined,options)}</small>
                  <i></i>
                </div>
              </li>
            ))}
        </ul>
      </div>
        <ChatComponent phone={phone}/>
        <AddNewContactmodal isOpen={isModalOpen} onClose={handleCloseModal} fetchNames={fetchNames} />
    </div>
  );
};

export default ChatScreen;
