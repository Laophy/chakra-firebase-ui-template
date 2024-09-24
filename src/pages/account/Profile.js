import {
  Text,
  Divider,
  Stack,
  Card,
  CardBody,
  Heading,
  Image,
  Button,
  Input,
  CardFooter,
  useToast,
  CircularProgress,
  Avatar,
  HStack,
  useBreakpointValue,
  useColorModeValue,
  IconButton,
  Textarea,
  EditableTextarea,
  Editable,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, setProfilePicture } from "../../redux/userSlice";
import { updateUsername } from "../../services/UserManagement.service";
import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react"; // Add this import

export default function Profile() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  const authHeader = useSelector((state) => state.data.user.authHeader);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const bg = useColorModeValue("gray.100", "gray.700");
  const dispatch = useDispatch();
  const toast = useToast();
  const { onCopy } = useClipboard(user?.uid); // Add this line

  const [newUsername, setNewUsername] = useState(user.username);
  const [newBio, setNewBio] = useState(user.bio);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [isLoading, setIsLoading] = useState(false); // Add this line

  useEffect(() => {
    console.log(user);
  }, []);

  const onUpdateProfile = async () => {
    setIsLoading(true); // Add this line
    const userUpdate = {
      bio: newBio,
      username: newUsername,
      photoURL: photoURL,
    };

    try {
      const [res, mtsResponse] = await updateUsername(authHeader, userUpdate);
      if (mtsResponse) {
        toast({
          title: "Error",
          description: mtsResponse.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Success",
          description: "You have successfuly updated your profile.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        dispatch(setUsername(newUsername));
        dispatch(setProfilePicture(photoURL));
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Profile not updated.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Add this line
    }
  };

  return (
    <Stack>
      {!isMobile && (
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize="3xl">Profile</Text>
          <HStack>
            <Text fontSize="sm" as={"b"} color={"gray.400"}>
              {user.uid}
            </Text>
            <IconButton
              icon={<CopyIcon />}
              variant={"ghost"}
              onClick={() => {
                onCopy();
                toast({
                  title: "Copied",
                  description: "Coped your user ID to clipboard.",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            />
          </HStack>
        </HStack>
      )}
      <Divider />
      <Stack mt={4}>
        <Card direction={{ base: "column" }} variant="solid">
          <Stack>
            {user.photoURL ? (
              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                <Avatar
                  size="md"
                  name={user?.username}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={photoURL ? photoURL : user?.photoURL}
                  alt={photoURL ? photoURL : user?.photoURL}
                />
                <Avatar
                  size="xl"
                  name={user?.username}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={photoURL ? photoURL : user?.photoURL}
                  alt={photoURL ? photoURL : user?.photoURL}
                />
                <Avatar
                  size="2xl"
                  name={user?.username}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={photoURL ? photoURL : user?.photoURL}
                  alt={photoURL ? photoURL : user?.photoURL}
                />
              </HStack>
            ) : (
              <CircularProgress
                isIndeterminate
                objectFit="contain"
                maxW={{ base: "100%" }}
                m={5}
                p={2}
                mr={"auto"}
                ml={"auto"}
              />
            )}

            <CardBody>
              <Heading size="md" mb={4}>
                Profile Picture
              </Heading>
              <Button variant="outline">Upload Image</Button>
              <Text py="2" w={"60%"}>
                The maxiumum upload size is 200 KB. Accepted formats are jpg,
                png, and gif.
              </Text>
              <Stack mt={5}>
                <Text mb="8px">Photo URL</Text>
                <Input
                  value={photoURL}
                  onChange={(event) => setPhotoURL(event.target.value)}
                  placeholder="Profile Image URL"
                  size="lg"
                />
              </Stack>
              <Stack mt={5}>
                <Text mb="8px">Bio</Text>
                <Textarea
                  value={newBio}
                  onChange={(event) => setNewBio(event.target.value)}
                  placeholder="Bio"
                  size="lg"
                />
              </Stack>
              <Stack mt={5}>
                <Text mb="8px">Username</Text>
                <Input
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  placeholder="Username"
                  size="lg"
                />
              </Stack>
            </CardBody>
            <CardFooter>
              <Button
                variant="solid"
                colorScheme="teal"
                onClick={() => onUpdateProfile()}
                isLoading={isLoading} // Add this line
                isDisabled={isLoading} // Add this line
              >
                Update
              </Button>
            </CardFooter>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
