import React, { useState, FC } from "react";
import { FaRobot } from "react-icons/fa";
import ChatBot from "../components/ChatBot";

const ChatIcon: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition z-50"
        >
          <FaRobot size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-50"
            >
              ✕
            </button>

            {/* ChatBot Component */}
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatIcon;
