import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(null); // Initialize user state to null
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      setUser(userInfo);
    } catch (error) {
      console.error(
        "Error retrieving user information from localStorage:",
        error
      );
    }
  }, []); // Run effect only once on component mount

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser, // Consider adding a setUser function to update localStorage when user changes
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => useContext(ChatContext); // Renamed to useChatState for clarity

export default ChatProvider;
