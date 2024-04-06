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
const backendURL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.email === "") {
      toast.error("Email is required");
      return;
    } else if (user.password === "") {
      toast.error("Password is required");
      return;
    }

    try {
      const { data } = await axios.post(`${backendURL}/api/user/login`, user);
      if (data.success) {
        toast.success(data.message);
        console.log(data);
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

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          width="100%"
          style={{ marginTop: 15 }}
        >
          Login
        </Button>
      </VStack>
    </div>
  );
}

export default Login;
