import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/ChatLogics";
import ProfileModal from "./ProfileModel";
import UpdatedGroupChatModal from "./UpdatedGroupChatModal";
import { Spinner } from "@chakra-ui/spinner";
import { FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import "./Styles.css";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";
import animationData from "../../Animations/Typing.json";
import Lottie from "lottie-react";
import blueBoy from "../../Animations/blueBoy.json";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ENDPOINT = `${backendURL}`;
var socket, selectedChatComapre;

function SingleChatComponent({ fetchAgain, setFetchAgain }) {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.data);
    socket.on("connection", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        setNewMessage("");
        const { data } = await axios.post(
          `${backendURL}/api/message`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        socket.emit("new message", data.data);
        setMessage([...message, data.data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendURL}/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessage(data);
      setLoading(false);
      console.log(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatComapre = selectedChat;
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var typingTimer = 3000;
    setTimeout(() => {
      var timeDiff = new Date().getTime() - lastTypingTime;
      if (timeDiff >= typingTimer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false); // Set typing to false when user stops typing
      }
    }, typingTimer);
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatComapre ||
        selectedChatComapre._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([...notification, newMessageRecieved]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            pb={3}
            fontFamily={"Work Sans"}
            fontSize={{ base: "1.3rem", md: "1rem", lg: "1.3rem" }}
            px={2}
            w={"100%"}
            height={"100%"}
            display={"flex"}
            flexDir={"column"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <Box
              w={"100%"}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat(null)}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdatedGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </Box>
            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"flex-end"}
              p={3}
              bg="#E8E8E8"
              width={"100%"}
              borderRadius={"lg"}
              height={"100%"}
              overflowY={"hidden"}
            >
              {loading ? (
                <Spinner
                  size={"xl"}
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin={"auto"}
                />
              ) : (
                <div className="messages">
                  <ScrollableChats messages={message} />
                </div>
              )}

              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? (
                  <div
                    style={{
                      width: "70px",
                      marginBottom: "15px",
                      marginLeft: "0px",
                    }}
                  >
                    <Lottie animationData={blueBoy} />
                  </div>
                ) : (
                  ""
                )}
                <Input
                  placeholder="Type a message"
                  variant={"filled"}
                  bg="#E0E0E0"
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
            </Box>
          </Text>
        </>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          w={"100%"}
          h={"100%"}
        >
          <Text
            pb={3}
            fontFamily={"Work Sans"}
            fontSize={{ base: "1.3rem", md: "1rem", lg: "1.3rem" }}
            margin={"auto"}
          >
            <Lottie animationData={animationData} style={{ width: "400px" }} />
            Select a chat to start messaging
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChatComponent;
