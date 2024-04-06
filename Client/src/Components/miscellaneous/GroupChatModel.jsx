import React, { useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

function GroupChatModel({ children }) {
  const { user, chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [grpChatName, setGrpChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/user/getUsers?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(data.data);
      setLoading(false);
      setSearchResult(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!grpChatName) {
      toast.error("Please enter chat name");
      return;
    }
    if (selectedUsers.length < 2) {
      toast.error("Please add more users to create group chat");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/creategroup",
        {
          name: grpChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(data);
      setChats([data, ...chats]);
      onClose();
      setGrpChatName("");
      setSelectedUsers([]);
      toast.success("Group chat created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            fontFamily={"Work Sans"}
            fontSize={"1.5rem"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={grpChatName}
                onChange={(e) => setGrpChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users eg: Praveen, Ravi, Prabhas"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "left",
              }}
            >
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading
              ? ""
              : searchResult
              ? searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              : "No user found"}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModel;
