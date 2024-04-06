import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Stack, Text, Avatar } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender, getSenderProfilePic } from "../../Config/ChatLogics";
import GroupChatModel from "./GroupChatModel";
import LastMessageofChat from "../../Config/LastMessageofChat";
import { useChatState } from "../../Context/ChatProvider";
import NotificationBadge from "../Parts/NotificationBadge";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function MyChats({ fetchAgain }) {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChatState();

  console.log(notification);

  const [loggedUser, setLoggedUser] = useState(user);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/chat`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const Data = data.chats;
      setChats(Data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user.token, fetchAgain]);

  //Filter and Count Chat Notifications
  const filterNotifications = (chatId) => {
    console.log(chatId);
    var count = 0;
    notification.forEach((n) => {
      if (n.chat._id === chatId) {
        count++;
      }
    });
    console.log(count);
    return count;
  };

  //Clear Notifications
  const handleNotificationClear = async (chatId) => {
    setNotification(notification.filter((n) => n.chat._id !== chatId));
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg={"white"}
      height={"100%"}
      w={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
      borderWidth={1}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "1.3rem", md: "1rem", lg: "1.3rem" }}
        fontFamily={"Work Sans"}
        w={"100%"}
        display={"flex"}
        justifyContent={{ base: "flex-end", md: "space-between" }}
        alignItems={"center"}
      >
        <Text display={{ base: "none", md: "flex" }}>My Chats</Text>
        <GroupChatModel>
          <Button
            fontSize={{ base: "0.8rem", md: "0.7rem", lg: "1rem" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box
        p={3}
        bg="#F8F8F8"
        w={"100%"}
        height={"90%"}
        borderRadius={"lg"}
        borderWidth={1}
        overflowY={"hidden"}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat, i) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat), handleNotificationClear(chat._id);
                }}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                position={"relative"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size="md"
                  cursor={"pointer"}
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                  }
                  src={
                    chat.isGroupChat
                      ? chat.profilePic
                      : getSenderProfilePic(loggedUser, chat.users)
                  }
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text
                    ml={2}
                    fontSize={{ base: "15px", md: "20px" }}
                    fontWeight={600}
                  >
                    {(chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                    ).substring(0, 20)}
                  </Text>
                  <Text ml={2} fontSize={{ base: "11px", md: "15px" }}>
                    {<LastMessageofChat value={chat._id} user={user} />}
                  </Text>
                </div>

                {filterNotifications(chat._id) > 0 && (
                  <div style={{ position: "absolute", right: "10px" }}>
                    <NotificationBadge value={filterNotifications(chat._id)} />
                  </div>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
