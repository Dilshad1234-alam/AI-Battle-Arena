import { useEffect, useState } from "react";
import { getChats, invokeChat, deleteChat } from "../api/chat.api";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      const data = await getChats();
      setMessages(data);
    } catch (error) {
      console.log("Fetch chats error:", error);
    }
  };

  const sendMessage = async (input) => {
    try {
      setLoading(true);
      setSelectedChat(null);

      const data = await invokeChat({ input });

      setMessages((prev) => [data.result, ...prev]);

      return data.result;
    } catch (error) {
      console.log("Invoke chat error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeChat = async (id) => {
    try {
      await deleteChat(id);

      setMessages((prev) =>
        prev.filter((chat) => chat._id !== id)
      );

      if (selectedChat?._id === id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.log("Delete chat error:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    messages,
    setMessages,
    selectedChat,
    setSelectedChat,
    loading,
    sendMessage,
    removeChat,
    fetchChats,
  };
}