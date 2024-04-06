import React, { useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  IconButton,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import toast from "react-hot-toast";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
import { Spinner } from "@chakra-ui/spinner";
const backendURL = import.meta.env.VITE_BACKEND_URL;


function UpdatedGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const [grpChatName, setGrpChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remaneLoading, setRenameLoading] = useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast.error("Only Admin can remove users from group");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendURL}/api/chat/removemember`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSelectedChat(data.chat);
      fetchMessages();
      setFetchAgain(!fetchAgain);
      toast.success("User deleted from group");
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (user) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendURL}/api/chat/removemember`,
        {
          chatId: selectedChat._id,
          userId: user.data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data.success) {
        setSelectedChat(data.chat);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        toast.success("You left the group");
      } else {
        toast.error(data.message);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast.error("Only Admin can add users to group");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendURL}/api/chat/addmember`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      toast.success("User added to group");
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendURL}/api/user/getUsers?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(data.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!grpChatName) {
      toast.error("Please enter chat name");
      return;
    }

    try {
      setRenameLoading(true);

      const { data } = await axios.put(
        `${backendURL}/api/chat/renamegrp`,
        { chatId: selectedChat._id, chatName: grpChatName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRenameLoading(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      onClose();
      toast.success("Chat name updated");
    } catch (error) {
      console.error(error);
      setRenameLoading(false);
    }
    setGrpChatName("");
  };

  const handleDeleteGroup = async () => {
    if (selectedChat.groupAdmin._id !== user.data._id) {
      toast.error("Only Admin can delete group");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${backendURL}/api/chat/deletegrp`,
        {
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      toast.success("Group deleted successfully");
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton mb={4} onClick={onOpen} icon={<ViewIcon />} />
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"} flexDir={"row"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={grpChatName}
                onChange={(e) => setGrpChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                ml={1}
                isLoading={remaneLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users eg: Praveen, Ravi, Prabhas"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                .slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleLeaveGroup(user)}>
              Leave Group
            </Button>
            {/* <Button
              colorScheme="red"
              ml={1}
              onClick={() => handleDeleteGroup()}
            >
              Delete Group
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdatedGroupChatModal;
