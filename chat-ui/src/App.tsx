import "./App.css";
import { IoSend } from "react-icons/io5";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8080/ws-message";

function App() {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [client, setClient] = useState<null | Client>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected,
    });

    setClient(stompClient);

    function onConnected() {
      console.log("Connected!!");
      stompClient.subscribe("/topic/message", function (msg) {
        if (msg.body) {
          var jsonBody = JSON.parse(msg.body);
          if (jsonBody.message) {
            setMessages((values) => [...values, jsonBody.message]);
          }
        }
      });
    }

    function onDisconnected() {
      console.log("Disconnected!!");
    }

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (client) {
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify({ message: newMessage }),
      });

      setNewMessage("");
    }
  };

  return (
    <div className="container">
      <div className="chat">
        <div className="messages">
          {messages &&
            messages.map((message, index) => (
              <div className="content" key={index}>
                {message}
              </div>
            ))}
        </div>

        <div className="send">
          <input
            type="text"
            value={newMessage || ""}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IoSend className="icon-send" onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;
