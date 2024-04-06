import { useEffect, useState } from "react";
import axios from "axios";
import { useChatState } from "../Context/ChatProvider";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const LastMessageofChat = ({ value, user }) => {
  const [lastMessage, setLastMessage] = useState("");
  const { notification, selectedChats } = useChatState();

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/api/message/${value}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (data && data.length > 0) {
          setLastMessage(data[data.length - 1].content.substring(0, 20));
        }
      } catch (error) {
        console.error("Error fetching last message:", error);
      }
    };

    fetchLastMessage();

    // Cleanup function
    return () => {};
  }, [value, user.token, notification, selectedChats]);

  return <>{lastMessage}</>;
};

export default LastMessageofChat;
