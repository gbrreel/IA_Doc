'use client'
import { useState } from "react";

type Message = {
  text: string;
  sender: "user" | "bot";
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Qual código você precisa que eu escreva a documentação hoje?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
  
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao enviar mensagem.");
      }

      const data = await res.json();
      setMessages([...messages, newMessage, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages([...messages, { text: `Erro ao enviar mensagem: ${error.message}`, sender: "bot" }]);
    } finally {
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === "bot" ? "bg-gray-200 text-gray-800 self-start" : "bg-blue-500 text-white self-end"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex p-2 border-t bg-gray-100">
          <input
            type="text"
            className="flex-1 p-3 border rounded-xl text-sm outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            onClick={sendMessage}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}