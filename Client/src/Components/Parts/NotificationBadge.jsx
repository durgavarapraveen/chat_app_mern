import React from "react";
import { Box, Text } from "@chakra-ui/react";

function NotificationBadge({ value }) {
  console.log(value);
  return (
    <Box
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      bg={"red.500"}
      color={"white"}
      borderRadius="full"
      w={"20px"}
      h={"20px"}
    >
      <Text fontSize={12}>{value}</Text>
    </Box>
  );
}

export default NotificationBadge;
