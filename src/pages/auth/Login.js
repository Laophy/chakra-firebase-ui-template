import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
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
import { useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const toast = useToast();

  const onLoginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        navigate("/");
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

  const onLoginGoogleUser = async () => {
    try {
      await signInWithPopup(auth, provider).then(() => {
        navigate("/");
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

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={"100%"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Welcome Back</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Sign In to Access Your Account
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
                <Text>Sign in with Google</Text>
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
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack>
              <Button
                color={"white"}
                onClick={() => {
                  onLoginUser();
                }}
              >
                Sign in
              </Button>
              <Stack align={"center"}>
                <Text fontSize={"lg"}>Don't Have an Account? </Text>
                <Text fontSize={"lg"} color={"blue.400"}>
                  <Link to="/account/register" style={{ color: "blue.500" }}>
                    Register
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
