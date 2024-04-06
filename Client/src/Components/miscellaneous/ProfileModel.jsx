import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import React from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function ProfileModel({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work Sans"
            d="flex"
            justifyContent="center"
            textAlign={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            margin={"auto"}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.profilePic}
              alt={user.name}
              margin={"10px auto"}
            />
            <Text
              fontSize={{ base: "20px", md: "20px" }}
              fontFamily={"Work Sans"}
            >
              Email : {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel;
