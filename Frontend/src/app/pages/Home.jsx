import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import ChatHistory from "../components/ChatHistory";
import useChat from "../hooks/useChat";

export default function Home() {
  const {
    messages,
    selectedChat,
    setSelectedChat,
    loading,
    sendMessage,
    removeChat,
  } = useChat();

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("arena-theme") !== "light";
  });

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-1 min-w-0">
        <ChatInterface
          messages={messages}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          loading={loading}
          sendMessage={sendMessage}
          dark={dark}
          setDark={setDark}
        />
      </div>

      <ChatHistory
        messages={messages}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        removeChat={removeChat}
      />
    </div>
  );
}