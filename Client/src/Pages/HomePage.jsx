import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";
import { useChatState } from "../Context/ChatProvider";

function HomePage() {
  document.title = "Login | Connect";

  const navigate = useNavigate();
  const { user } = useChatState();
  console.log("user", user);
  // useEffect(() => {
  //   if (user) {
  //     window.location.href = "/chat";
  //   }
  // }, [user]);

  return (
    <div className="Login-Container">
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          alignItems="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="4xl" fontFamily="Work sans" align="center">
            Connect
          </Text>
        </Box>

        <Box
          bg="white"
          w="100%"
          p={4}
          color="black"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
