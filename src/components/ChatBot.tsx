import React, { useState, FC, KeyboardEvent } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import axios from "axios";

interface Message {
  from: "user" | "bot";
  text: string;
}

const pandemicResponses: Record<string, string> = {
  hi: "Hello! I am your pandemic assistant. How can I help you today?",
  symptoms: "Common symptoms include fever, cough, and difficulty breathing. If you have severe symptoms, contact your local health authority immediately.",
  prevention: "Wash your hands frequently, wear masks in crowded places, and maintain social distancing.",
  vaccine: "Vaccination is key! Please visit your local health department to get the latest updates on vaccines.",
  default: "I'm here to help with pandemic-related questions. Try asking about symptoms, prevention, or vaccines.",
};

const ELEVENLABS_API_KEY = "sk_cdb5106922f658f73854c288652fb90bf1f1fe5b3759d02b";
const VOICE_ID = "YOUR_VOICE_ID"; // default voice

const ChatBot: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: pandemicResponses.hi },
  ]);
  const [input, setInput] = useState<string>("");

  // Speak text using ElevenLabs TTS
  const speakText = async (text: string) => {
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        { text },
        {
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("ElevenLabs TTS error:", err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input };
    let botMessage: Message = { from: "bot", text: pandemicResponses.default };

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("symptom")) botMessage.text = pandemicResponses.symptoms;
    else if (lowerInput.includes("prevent") || lowerInput.includes("precaution"))
      botMessage.text = pandemicResponses.prevention;
    else if (lowerInput.includes("vaccine")) botMessage.text = pandemicResponses.vaccine;

    setMessages([...messages, userMessage, botMessage]);
    speakText(botMessage.text); // speak the bot response
    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-80 h-96 border rounded-lg flex flex-col shadow-lg">
      {/* Header */}
      <div className="bg-orange-500 text-white p-3 flex items-center gap-2">
        <FaRobot />
        <h2 className="font-bold">Pandemic Voice Bot</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.from === "user" ? "bg-orange-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 flex gap-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask me..."
        />
        <button onClick={handleSend} className="bg-orange-500 text-white px-3 py-1 rounded">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
