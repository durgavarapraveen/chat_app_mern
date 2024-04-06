import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Box, Button, Stack, Text, Avatar } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Chatloading from "./Chatloading";
import {
  getSender,
  getSenderProfilePic,
  isLastMessage,
} from "../../Config/ChatLogics";
import GroupChatModel from "./GroupChatModel";
import LastMessageofChat from "../../Config/LastMessageofChat";

function MyChats({ fetchAgain }) {
  const { selectedChat, setSelectedChat, user, chats, setChats, notification } =
    ChatState();
  console.log(user);
  const [loggedUser, setLoggedUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const Data = data.chats;
      console.log(Data);
      setChats(Data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, [user.token, fetchAgain]);

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
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <GroupChatModel>
          <Button
            d={"flex"}
            fontSize={{ base: "1rem", md: "0.7rem", lg: "1rem" }}
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
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
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
                  <Text ml={2} fontSize={20}>
                    {(chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                    ).substring(0, 20)}
                  </Text>
                  <Text ml={2} size={"sm"}>
                    {<LastMessageofChat value={chat._id} user={user} />}
                  </Text>
                </div>
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
