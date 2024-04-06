import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => setShow(!show);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);

  const postDetails = async (imageFile) => {
    setLoading(true);

    if (!imageFile) {
      toast.error("Please select an image");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "Chat-app");
    data.append("cloud_name", "dwly9mm6u");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwly9mm6u/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const imageData = await response.json();
      setUser({ ...user, picture: imageData.url });
      console.log(imageData.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.name === "") {
      return toast.warn("Name is required");
    }
    if (user.email === "") {
      return toast.warn("Email is required");
    }
    if (user.password === "") {
      return toast.warn("Password is required");
    }
    if (user.password !== user.confirmPassword) {
      return toast.warn("Passwords do not match");
    }

    console.log(user);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        user
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <VStack spacing="5px">
        <FormControl id="FirstName">
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </FormControl>

        <FormControl id="Email">
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </FormControl>

        <FormControl id="Password">
          <FormLabel>Passowrd</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter your Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <InputRightElement width={"4.5rem"}>
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="ConfirmPassword">
          <FormLabel>Confirm Passowrd</FormLabel>
          <InputGroup>
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your Password"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <InputRightElement width={"4.5rem"}>
              <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="picture">
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          width="100%"
          style={{ marginTop: 15 }}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </div>
  );
}

export default SignUp;
