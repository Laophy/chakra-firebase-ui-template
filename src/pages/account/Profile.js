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
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { setUsername, setProfilePicture } from "../../redux/userSlice";
import { updateUsername } from "../../services/UserManagement.service";

export default function Profile() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const dispatch = useDispatch();
  const toast = useToast();

  const [newUsername, setNewUsername] = useState(user.username);
  const [photoURL, setPhotoURL] = useState(user.photoURL);

  useEffect(() => {
    console.log(user);
  }, []);

  const onUpdateProfile = () => {
    try {
      updateProfile(auth.currentUser, {
        displayName: newUsername,
        photoURL: photoURL,
      })
        .then(async () => {
          const [res, mtsRes] = await updateUsername(
            auth.currentUser,
            newUsername
          );
          if (!mtsRes) {
            console.log(res);
          }
        })
        .then(dispatch(setUsername(newUsername)))
        .then(dispatch(setProfilePicture(photoURL)))
        .then(
          toast({
            title: "Success",
            description: "You have successfuly updated your profile.",
            status: "success",
            duration: 2000,
            isClosable: true,
          })
        );
    } catch (e) {
      toast({
        title: "Error",
        description: "Profile not updated. Error: " + e.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack>
      <Text fontSize="3xl">Profile</Text>
      <Divider />
      <Stack mt={4}>
        <Card direction={{ base: "column" }} variant="outline">
          <Stack>
            {user.photoURL ? (
              <Image
                objectFit="contain"
                maxW={{ base: "100%" }}
                m={5}
                p={2}
                mr={"auto"}
                ml={"auto"}
                borderRadius={25}
                src={user?.photoURL}
                alt={user?.username}
              />
            ) : (
              <CircularProgress
                isIndeterminate
                color="teal.300"
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
              <Button variant="outline" colorScheme="teal">
                Upload Image
              </Button>
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
