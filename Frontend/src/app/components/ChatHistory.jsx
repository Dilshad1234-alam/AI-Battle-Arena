import React from "react";

export default function ChatHistory({
  messages,
  selectedChat,
  setSelectedChat,
  removeChat,
}) {
  return (
    <aside className="hidden lg:block w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-white">
          Chat History
        </h2>

        <button
          onClick={() => setSelectedChat(null)}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
        >
          + New Chat
        </button>
      </div>

      <div className="p-3 space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">No history available</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => setSelectedChat(msg)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                selectedChat?._id === msg._id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex justify-between gap-2">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {msg.problem}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChat(msg._id);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}