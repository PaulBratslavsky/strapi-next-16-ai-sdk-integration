"use client";

import { useState, type SubmitEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const transport = new DefaultChatTransport({
  api: "http://localhost:1337/api/ai-sdk/chat",
});

export function ChatExample() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        /chat - Multi-turn Chat
      </h2>

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
                : "bg-zinc-100 dark:bg-zinc-800 mr-auto max-w-[80%]"
            }`}
          >
            <p className="text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">
              {message.role === "user" ? "You" : "AI"}
            </p>
            <p className="text-black dark:text-white whitespace-pre-wrap">
              {message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
