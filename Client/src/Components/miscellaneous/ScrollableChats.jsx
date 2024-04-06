import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
} from "../../Config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";

function ScrollableChats({ messages }) {
  const { user } = ChatState();

  console.log(messages);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div key={index} style={{ display: "flex" }}>
            {(isSameSender(messages, message, index, user.data._id) ||
              isLastMessage(messages, index, user.data._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size="sm"
                  cursor={"pointer"}
                  name={message.sender.name}
                  src={message.sender.profilePic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user.data._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user.data._id
                ),
                marginTop: isSameSender(messages, message, index)
                  ? "3px"
                  : "10px",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChats;
