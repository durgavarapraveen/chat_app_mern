import React from "react";
import { Box } from "@chakra-ui/react";
import SingleChatComponent from "./SingleChatComponent";
import { useChatState } from "../../Context/ChatProvider";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      width={{ base: "100%", md: "69%" }}
      flexDir={"column"}
      p={3}
      bg={"white"}
      borderRadius={"lg"}
      borderWidth={1}
    >
      <SingleChatComponent
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
}

export default ChatBox;
