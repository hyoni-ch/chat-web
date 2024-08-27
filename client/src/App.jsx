import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <button
        onClick={handleChatToggle}
        type="button"
        className="text-white bg-black hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
      >
        {isChatOpen ? "X" : "채팅"}
      </button>

      {isChatOpen && <ChatWindow />}
    </div>
  );
}

export default App;
