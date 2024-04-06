import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/miscellaneous/MyChats";
import ChatBox from "../Components/miscellaneous/ChatBox";
import { useChatState } from "../Context/ChatProvider";

function ChatPage() {
  
  const { user } = useChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }} className="Container">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
