import React, { useEffect, useState, useRef } from "react";
import "./ChatScreen.css";
import ChatComponent from "./ChatComponent";

const ChatScreen = () => {
  const [names, setNames] = useState([]);
  const [phone, setPhone] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };

  useEffect(() => {
    async function fetchNames() {
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
    }

    fetchNames();
  }, []);

  return (
    <div id="chatlist">
      <div className="chat-menu">
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
    </div>
  );
};

export default ChatScreen;
