import React, { useState, useRef, useEffect } from "react";
import UserMessage from "./UserMessage";
import ArenaResponse from "./ArenaResponse";
import axios from "axios";

const PROMPT_EXAMPLES = [
  "Write factorial function in JavaScript",
  "Create Express.js authentication API",
  "Explain React hooks with example",
  "Optimize bubble sort in JavaScript",
  "Create MongoDB product schema",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("arena-theme") !== "light";
  });

  const mainScrollRef = useRef(null);
  const asideScrollRef = useRef(null);

  const displayedMessages = selectedChat ? [selectedChat] : currentMessages;

  const scrollToBottom = () => {
    mainScrollRef.current?.scrollTo({
      top: mainScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chats`);
        setMessages(res.data);
      } catch (error) {
        console.log("Fetch history error:", error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("arena-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();

    const userInput = inputValue.trim();
    if (!userInput || loading) return;

    setSelectedChat(null);
    setInputValue("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chats/invoke`,
        { input: userInput }
      );

      const newMessage = response.data.result;

      setCurrentMessages((prev) => [...prev, newMessage]);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      const errorChat = {
        _id: Date.now().toString(),
        problem: userInput,
        solution_1: ` Backend Error: ${errorMessage}`,
        solution_2: "Backend terminal check karo.",
        judge: null,
        createdAt: new Date().toISOString(),
      };

      setCurrentMessages((prev) => [...prev, errorChat]);
      setMessages((prev) => [...prev, errorChat]);
    } finally {
      setLoading(false);
    }
  };

  const clearView = () => {
    setSelectedChat(null);
    setCurrentMessages([]);
    setInputValue("");
    setLoading(false);
  };

  const openHistoryChat = (msg) => {
    setSelectedChat(msg);
  };

  const handleDeleteChat = async (id) => {
    const ok = window.confirm("Delete this chat permanently?");
    if (!ok) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${id}`);

      setMessages((prev) => prev.filter((chat) => chat._id !== id));
      setCurrentMessages((prev) => prev.filter((chat) => chat._id !== id));

      if (selectedChat?._id === id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.log("Delete chat error:", error);
    }
  };

  const downloadResult = (msg) => {
    const content = `# AI Battle Arena Result

## Problem
${msg.problem}

## Solution 1 - Mistral
${msg.solution_1}

## Solution 2 - Cohere
${msg.solution_2}

## Judge - Cohere

Solution 1 Score: ${msg.judge?.solution_1_score ?? "N/A"}/10

${msg.judge?.solution_1_reasoning ?? ""}

Solution 2 Score: ${msg.judge?.solution_2_score ?? "N/A"}/10

${msg.judge?.solution_2_reasoning ?? ""}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-arena-result.md";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="py-4 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Chat Arena
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={clearView}
              className="text-sm px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              New Chat
            </button>

            <button
              onClick={() => setDark((prev) => !prev)}
              className="text-sm px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main
          ref={mainScrollRef}
          className="relative flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-6xl mx-auto flex flex-col"
        >
          {displayedMessages.length === 0 && !loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2 text-zinc-900 dark:text-zinc-300">
                  Welcome to the Arena
                </h2>

                <p className="mb-6 text-zinc-500">
                  Type a problem below to see Mistral and Cohere go head-to-head.
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {PROMPT_EXAMPLES.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            displayedMessages.map((msg) => (
              <div key={msg._id || msg.id} className="mb-12">
                <UserMessage message={msg.problem} />

                <div className="flex justify-end px-4 mb-2">
                  <button
                    onClick={() => downloadResult(msg)}
                    className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Download .md
                  </button>
                </div>

                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))
          )}

          {loading && (
            <div className="max-w-md mx-auto w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                <p className="animate-pulse"> Mistral thinking...</p>
                <p className="animate-pulse"> Cohere thinking...</p>
                <p className="animate-pulse"> Judge evaluating...</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={scrollToBottom}
            className="fixed bottom-28 right-[350px] z-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 w-10 h-10 rounded-full shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ↓
          </button>
        </main>

        <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a coding question..."
                className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-none rounded-full py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-400 transition-shadow shadow-sm hover:shadow-md text-lg"
              />

              <button
                type="submit"
                className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputValue.trim() || loading}
              >
                {loading ? (
                  "..."
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <aside
        ref={asideScrollRef}
        className="hidden lg:block w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto"
      >
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Chat History
          </h2>

          <button
            onClick={clearView}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
          >
            + New Chat
          </button>
        </div>

        <div className="p-3 space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-500">No history available</p>
          ) : (
            [...messages].reverse().map((msg) => (
              <div
                key={msg._id || msg.id}
                className={`p-3 rounded-xl border transition ${
                  selectedChat?._id === msg._id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => openHistoryChat(msg)}
                  >
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {msg.problem}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(msg.createdAt || msg.id).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteChat(msg._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Delete Chat"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}