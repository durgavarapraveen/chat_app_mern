import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

function UserListItem({ user, handleFunction }) {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor={"pointer"}
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          mr={2}
          cursor={"pointer"}
          name={user.name}
          src={user.profilePic}
        />
        <Box width={"fit-content"}>
          <Text fontSize="large">{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
}

export default UserListItem;
