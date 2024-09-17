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
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { setUsername, setProfilePicture } from "../../redux/userSlice";
import {
  updateUser,
  updateUsername,
} from "../../services/UserManagement.service";

export default function Profile() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const bg = useColorModeValue("gray.100", "gray.700");
  const dispatch = useDispatch();
  const toast = useToast();

  const [newUsername, setNewUsername] = useState(user.username);
  const [photoURL, setPhotoURL] = useState(user.photoURL);

  useEffect(() => {
    console.log(user);
  }, []);

  const onUpdateProfile = async () => {
    const userUpdate = {
      username: newUsername,
      photoURL: photoURL,
    };

    try {
      const [res, mtsRes] = await updateUsername(user, userUpdate);
      if (res) {
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
      toast({
        title: "Error",
        description: "Profile not updated.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack>
      {!isMobile && <Text fontSize="3xl">Profile</Text>}
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
