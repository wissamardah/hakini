import React, { useEffect, useState, useRef } from 'react';
import './ChatComponent.css';

const ChatComponent = ({phone}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const [mobile,setMobile]=useState("")
  const fetchMessages = async () => {
    const response = await fetch(process.env.REACT_APP_API_URL+'/api/getWhatsappMessages/'+phone, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("token")}` // replace with your token
      },
    });

    const data = await response.json();
    if (data.status === 'success') {
      setMessages(data.data.reverse());
    }
  };

  useEffect(()=>{

    const searchParams = new URLSearchParams(document.location.search)
   
    setMobile( searchParams.get('mobile'))
  },[])
  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage !== '') {
      await fetch(process.env.REACT_APP_API_URL+'/api/sendWhatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}` // replace with your token
        },
        body: JSON.stringify({
          to: phone,
          message: newMessage
        }),
      });
      setNewMessage('');
      await fetchMessages();
    }
  };

  useEffect(() => {
    if(!phone) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [phone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sender = messages.find(message => message.sent === 0);

  return (
    <div id='chatbody'>
      <div id="title1">
        {/* Adapt this to your needs */}
        <h3 id="sendername">{sender ? sender.name : ''}</h3>
        <p id="senderDetails">{sender ? sender.phone : ''}</p>
      </div>

      <div id="chatContainer">
        {messages.map((message) => (
          <div className={`message ${message.sent ? 'sent' : 'received'}`} key={message.id}>
            <div className="bubble">
              {message.message}
              <div className="status">{message.sent ? (message.status === "sent" ? "✔️" : message.status === "delivered" ? "✔️✔️" : message.status === "read" ? "✔️✔️✔️" : "") : ''}</div>

              <div className="time">
                {new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form id="sendMessageForm" onSubmit={sendMessage}>
        <input type="text" id="messageInput" placeholder="أكتب رسالتك هنا ..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button type="submit">ارسال</button>
      </form>
    </div>
  );
};

export default ChatComponent;
