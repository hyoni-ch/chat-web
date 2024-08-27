import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import NicknameModal from "./NicknameModal";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, { text: msg.text, sender: msg.sender }]);
    });

    newSocket.on("user connected", (user) => {
      setMessages((prevMessages) => [...prevMessages, { text: `${user}님이 입장하였습니다.`, sender: "system" }]);
    });

    newSocket.on("user disconnected", (user) => {
      setMessages((prevMessages) => [...prevMessages, { text: `${user}님이 나가셨습니다.`, sender: "system" }]);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleNicknameSubmit = (nick) => {
    setNickname(nick);
    socket.emit("set nickname", nick);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("chat message", { text: message });
      setMessage("");
    }
  };

  if (showModal) {
    return <NicknameModal onSubmit={handleNicknameSubmit} />;
  }

  return (
    <div className="fixed bottom-20 right-4 w-96 rounded-md border shadow">
      <ul className="p-4 h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`flex mb-1 ${
              msg.sender === nickname ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"
            }`}
          >
            <div className="flex flex-col">
              <div className="text-xs">{msg.sender != nickname && msg.sender != "system" ? msg.sender : ""}</div>
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === nickname
                    ? "bg-black text-white shadow"
                    : msg.sender === "system"
                    ? "bg-gray-300 text-white"
                    : "bg-white shadow"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-700"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-950 transition duration-300 whitespace-nowrap"
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
