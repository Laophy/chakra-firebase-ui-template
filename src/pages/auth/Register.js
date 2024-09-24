import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Center,
  Button,
  Heading,
  Text,
  useColorModeValue,
  AbsoluteCenter,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { isValidEmail } from "../../utilities/validation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const toast = useToast();

  const onLoginGoogleUser = async () => {
    try {
      await signInWithPopup(auth, provider).then(() => {
        navigate("/packs");
        toast({
          title: "Success",
          description: "You have successfuly logged in.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const validateForm = () => {
    if (username.length < 3) {
      toast({
        title: "Invalid Username",
        description: "Username must be at least 3 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCred) => {
          updateProfile(userCred.user, { displayName: username })
            .then(navigate("/"))
            .then(() => {
              toast({
                title: "Success",
                description: "You have successfuly logged in.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={"100%"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Create Your Account Today</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Sign Up to Get Started
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {/* Google */}
            <Button
              w={"full"}
              variant={"outline"}
              leftIcon={<FcGoogle />}
              onClick={() => onLoginGoogleUser()}
            >
              <Center>
                <Text>Sign up with Google</Text>
              </Center>
            </Button>
            <Text fontSize={"12px"} color={"gray.400"} textAlign={"center"}>
              By accessing this site, I attest that I am at least 18 years old
              and agree to the Terms of Service.
            </Text>
            <Box position="relative" padding="5">
              <Divider />
              <AbsoluteCenter bg={useColorModeValue("white", "gray.700")}>
                Or
              </AbsoluteCenter>
            </Box>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Text fontSize={"12px"} color={"gray.400"} textAlign={"center"}>
                By accessing this site, I attest that I am at least 18 years old
                and agree to the Terms of Service.
              </Text>
              <Button color={"white"} onClick={() => handleSignup()}>
                Sign Up
              </Button>
              <Stack align={"center"}>
                <Text fontSize={"lg"}>Already Have an Account? </Text>
                <Text fontSize={"lg"} color={"blue.400"}>
                  <Link to="/account/login" style={{ color: "blue.500" }}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
