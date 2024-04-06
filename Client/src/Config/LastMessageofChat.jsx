import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";

const LastMessageofChat = ({ value, user }) => {
  const [lastMessage, setLastMessage] = useState("");
  const { notification, selectedChats } = ChatState();

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/message/${value}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(data[data.length - 1].content);
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
