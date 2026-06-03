import { useState } from "react";
import axios from "axios";

export default function AIChatUI() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const sendMessage = async () => {
    if (!prompt) return;

    // add user message
    const userMessage = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5001/api/ai/ask-ai", {
        prompt: prompt,
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setPrompt("");
    } catch (error) {
      console.log(error);
    }
  };

  const generatePdf = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/ai/generate-pdf",
        {
          prompt,
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "report.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 p-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Expense Assistant</h1>
            <p className="text-slate-400 text-sm mt-1">
              Upload receipts and ask AI questions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-slate-300">AI Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-[650px]">
          {/* Sidebar */}
          <div className="border-r border-slate-800 p-5 bg-slate-900/50">
            <button className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-2xl py-3 font-semibold shadow-lg">
              + New Chat
            </button>

            <div className="mt-6">
              <h2 className="text-sm text-slate-400 mb-3">
                Recent Conversations
              </h2>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 cursor-pointer transition">
                  <p className="font-medium">Receipt Analysis</p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI categorized expenses
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 cursor-pointer transition">
                  <p className="font-medium">Monthly Report</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Generated spending summary
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-sm text-slate-400 mb-3">Upload Receipt</h2>

              <label className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition">
                <div className="text-4xl mb-3">📄</div>
                <p className="font-medium">Upload Image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>

                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-950 to-slate-900">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 items-start ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                      AI
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-5 py-4 max-w-xl shadow-lg ${
                      msg.role === "user" ? "bg-blue-600" : "bg-slate-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {msg.role === "user" && (
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                      U
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}

            <div className="border-t border-slate-800 p-5 bg-slate-900">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
                />

                {prompt.toLowerCase().includes("generate pdf") ? (
                  <button
                    onClick={generatePdf}
                    className="bg-green-600 hover:bg-green-500 transition px-6 py-4 rounded-2xl font-semibold"
                  >
                    Generate PDF
                  </button>
                ) : (
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-500 transition px-6 py-4 rounded-2xl font-semibold shadow-lg"
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
