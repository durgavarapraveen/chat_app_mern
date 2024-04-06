import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import Chatloading from "./Chatloading";
import UserListItem from "./UserListItem";
import { getSender } from "../../Config/ChatLogics";
import { Badge } from "primereact/badge";

function SideDrawer() {
  const navigate = useNavigate();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const btnRef = React.useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    console.log("Logged Out");
    navigate("/");
  };

  const handleSearch = async () => {
    console.log(search);
    if (!search) {
      return toast.error("Please enter something to search");
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/user/getUsers?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data.data);
      setSearchResult(data.data);
      setLoading(false);
      setSearch("");
    } catch (error) {
      console.error(error);
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/getChat",
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!chats.find((c) => c._id === data.chat._id))
        setChats([data.chat, ...chats]);
      setSelectedChat(data.chat);
      setLoadingChat(false);
      onClose();
      setSearchResult([]);
      console.log(data.chat);
    } catch (error) {
      toast.error("Error in accessing chat");
      console.error(error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        bg={"white"}
        p="5px 10px"
        borderWidth={2}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} ref={btnRef} onClick={onOpen}>
            <FiSearch />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1}>
                <Badge value="2" severity="danger"></Badge>
              </BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter((noti) => noti !== n));
                  }}
                >
                  {n.chat.isGroupChat
                    ? `New message in ${n.chat.chatName}`
                    : `New message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.data.name}
                src={user.data.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user.data}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} p={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : searchResult.length > 0 ? (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <span>No users found</span>
            )}
            {loadingChat && <Spinner ml={"auto"} d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
