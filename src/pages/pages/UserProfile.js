import {
  Container,
  Heading,
  Stack,
  Text,
  Avatar,
  Box,
  Spinner,
  Button,
  useColorModeValue,
  Badge,
  Center,
  Tag,
  TagLeftIcon,
  TagLabel,
  useClipboard,
  useToast,
  HStack,
  FormLabel,
  Input,
  FormControl,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getfirebaseUser,
  updateUser,
} from "../../services/UserManagement.service";
import { useEffect, useState } from "react";
import { formatMoney } from "../../utilities/Formatter";
import { AddIcon, CopyIcon } from "@chakra-ui/icons";
import moment from "moment";

export default function UserProfile() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  // Grabbing uid from URL parameters
  const { uid } = useParams();

  const [profile, setProfile] = useState(null);

  const { hasCopied, onCopy } = useClipboard(profile?.uid || "");
  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCopy = () => {
    onCopy();
    showToast("Copied", "User ID copied to clipboard", "success");
  };

  const attemptSaveChanges = async () => {
    try {
      const [res] = await updateUser(user, profile.uid, profile);
      if (res) {
        showToast("Success", "Profile changes saved successfully", "success");
      }
    } catch (e) {
      showToast("Error", "Failed to save profile changes", "error");
    }
  };

  const attemptMute = async () => {
    try {
      showToast("Success", "Profile muted successfully", "success");
    } catch (e) {
      showToast("Error", "Failed to mute", "error");
    }
  };

  const attemptBan = async () => {
    try {
      showToast("Success", "Profile banned successfully", "success");
    } catch (e) {
      showToast("Error", "Failed to ban", "error");
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, [uid]);

  const loadCurrentUser = async () => {
    const [userData, mtsResponse] = await getfirebaseUser({ uid });
    if (mtsResponse || !userData) {
      // something went wrong
      console.log("MTS RESPONSE!!");
      setProfile(null);
    } else {
      // when the user has data in the DB use that as the main override
      console.log("USER DATA: ", userData);
      setProfile(userData);
    }
  };

  const bgColor = useColorModeValue("white", "gray.900");
  const badgeBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.400");
  const buttonBgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      py={10}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        flexDirection={"column"}
        spacing={10}
      >
        {profile ? (
          <HStack w={"full"} alignItems="end">
            <Box
              maxW={"420px"}
              w={"full"}
              bg={bgColor}
              boxShadow={"2xl"}
              rounded={"lg"}
              p={6}
              textAlign={"center"}
              position="relative"
            >
              {user?.isStaff && (
                <Button
                  position="absolute"
                  top={4}
                  right={4}
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={<CopyIcon />}
                >
                  Copy ID
                </Button>
              )}
              {profile?.isStaff && (
                <Tag
                  position="absolute"
                  top={4}
                  left={4}
                  size="md"
                  variant="solid"
                  colorScheme={"red"}
                >
                  {profile?.isHighStaff ? "High Staff" : "Staff"}
                </Tag>
              )}
              <Avatar
                size={"2xl"}
                src={profile?.photoURL}
                mb={4}
                pos={"relative"}
                _after={{
                  content: '""',
                  w: 4,
                  h: 4,
                  bg: "green.300",
                  border: "2px solid white",
                  rounded: "full",
                  pos: "absolute",
                  bottom: 0,
                  right: 3,
                }}
              />
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                {profile?.username}
              </Heading>
              <Text fontWeight={600} color={"gray.500"}>
                @{profile?.username}
              </Text>
              {profile?.title?.title && (
                <Tag
                  size={"md"}
                  key={"sm"}
                  variant="solid"
                  colorScheme={profile?.title?.color}
                  mb={4}
                >
                  {profile?.title?.title}
                </Tag>
              )}

              {profile?.bio ? (
                <Text textAlign={"center"} color={textColor} px={3}>
                  {profile?.bio}
                </Text>
              ) : (
                <Text textAlign={"center"} color={textColor} px={3}>
                  No bio set
                </Text>
              )}

              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                direction={"row"}
                mt={1}
              >
                <Badge
                  colorScheme="blue"
                  px={2}
                  py={1}
                  bg={badgeBgColor}
                  fontWeight={"400"}
                >
                  <Text fontSize={"md"} color={"blue.400"}>
                    {formatMoney(profile?.balance)}
                  </Text>
                </Badge>
              </Stack>
              <Stack
                align={"center"}
                justify={"center"}
                direction={"row"}
                mt={6}
              >
                <Badge
                  colorScheme="blue"
                  px={2}
                  py={1}
                  bg={badgeBgColor}
                  fontWeight={"400"}
                >
                  Acount Created
                </Badge>
                <Badge
                  colorScheme="green"
                  px={2}
                  py={1}
                  bg={badgeBgColor}
                  fontWeight={"400"}
                >
                  {moment(new Date(profile?.createdAt)).fromNow()}
                </Badge>
              </Stack>
              <Stack mt={8} direction={"row"} spacing={4}>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _hover={{
                    bg: buttonBgColor,
                  }}
                >
                  Message
                </Button>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  _hover={{
                    bg: "blue.500",
                  }}
                  _focus={{
                    bg: "blue.500",
                  }}
                >
                  Tip Gems
                </Button>
              </Stack>
            </Box>
            {user?.isStaff && (
              <Box
                maxW={"420px"}
                w={"full"}
                bg={bgColor}
                boxShadow={"2xl"}
                rounded={"lg"}
                p={6}
                textAlign={"center"}
                position="relative"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <VStack spacing={4} align="stretch">
                  <Heading as="h3" size="md">
                    Edit Profile
                  </Heading>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="Enter username"
                      value={profile?.username || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Photo URL</FormLabel>
                    <Input
                      placeholder="Enter photo URL"
                      value={profile?.photoURL || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, photoURL: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                      placeholder="Enter bio"
                      value={profile?.bio || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </FormControl>
                  <HStack spacing={4} align="stretch">
                    <FormControl flex={1}>
                      <FormLabel>Title</FormLabel>
                      <Input
                        placeholder="Enter title"
                        value={profile?.title?.title || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            title: { ...profile?.title, title: e.target.value },
                          })
                        }
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel>Title Color</FormLabel>
                      <Input
                        placeholder="Enter title color"
                        value={profile?.title?.color || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            title: { ...profile?.title, color: e.target.value },
                          })
                        }
                      />
                    </FormControl>
                  </HStack>
                  <Button
                    onClick={attemptSaveChanges}
                    fontSize={"sm"}
                    rounded={"full"}
                    bg={"blue.400"}
                    color={"white"}
                    boxShadow={
                      "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                    }
                    _hover={{
                      bg: "blue.500",
                    }}
                    _focus={{
                      bg: "blue.500",
                    }}
                  >
                    Update User
                  </Button>
                  <HStack w={"full"}>
                    <Button
                      onClick={attemptMute}
                      w={"50%"}
                      fontSize={"sm"}
                      rounded={"full"}
                      bg={"purple.400"}
                      color={"white"}
                      boxShadow={
                        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                      }
                      _hover={{
                        bg: "purple.500",
                      }}
                      _focus={{
                        bg: "purple.500",
                      }}
                    >
                      Mute
                    </Button>
                    <Button
                      onClick={attemptBan}
                      w={"50%"}
                      fontSize={"sm"}
                      rounded={"full"}
                      bg={"red.400"}
                      color={"white"}
                      boxShadow={
                        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                      }
                      _hover={{
                        bg: "red.500",
                      }}
                      _focus={{
                        bg: "red.500",
                      }}
                    >
                      Ban
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}
          </HStack>
        ) : (
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        )}
      </Stack>
    </Container>
  );
}
