import { ChevronLeftIcon, Search2Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Text,
  Divider,
  Stack,
  CardBody,
  Card,
  Avatar,
  HStack,
  Flex,
  Button,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  CircularProgress,
  Center,
  useToast,
  Tag,
  IconButton,
  CardHeader,
  VStack,
  AvatarBadge,
  useColorModeValue,
  Hide,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserData,
  getUserByFirebaseAuth,
  onDemoteStaffToPlayer,
  onPromoteUserToStaff,
  updateUser,
} from "../../../services/UserManagement.service";
import {
  setBalance,
  setProfilePicture,
  setUsername,
} from "../../../redux/userSlice";
import { formatMoney } from "../../../utilities/Formatter";
import ColorPicker from "../../../components/tools/ColorPicker";

export default function AdminViewUsers() {
  const user = useSelector((state) => state.data.user.user);
  const authHeader = useSelector((state) => state.data.user.authHeader);

  const toast = useToast();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const [isLoadingDemote, setIsLoadingDemote] = useState(false);
  const [isLoadingPromote, setIsLoadingPromote] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [newUsername, setNewUsername] = useState(null);
  const [newPhotoURL, setNewPhotoURL] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newReferralCode, setNewReferralCode] = useState(null);
  const [newAffiliateCode, setNewAffiliateCode] = useState(null);
  const [newBalance, setNewBalance] = useState(null);
  const [newTitle, setNewTitle] = useState(null);

  const [color, setColor] = useState("purple");
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    initAllUserData();
  }, [editUser]);

  const initAllUserData = async () => {
    const [allUsers] = await getAllUserData();
    if (allUsers) {
      setUserList(allUsers);
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  const demoteToPlayer = async () => {
    setIsLoadingDemote(true);
    try {
      const [res, mtsResponse] = await onDemoteStaffToPlayer(
        authHeader,
        user,
        editUser.uid
      );
      if (mtsResponse) {
        showToast(
          "Error",
          mtsResponse.message || "Something went wrong.",
          "error"
        );
      } else {
        showToast(
          "Success",
          "You have successfully demoted this user to player.",
          "success"
        );
        const [updatedUser, mtsResponse] = await getUserByFirebaseAuth(
          editUser
        );
        console.log(updatedUser);
        setEditUser(updatedUser);
      }
    } catch (e) {
      showToast("Error", "Something went wrong.", "error");
    } finally {
      setIsLoadingDemote(false);
    }
  };

  const promoteToStaff = async () => {
    setIsLoadingPromote(true);
    try {
      const [res, mtsResponse] = await onPromoteUserToStaff(
        authHeader,
        editUser.uid
      );
      if (mtsResponse) {
        showToast(
          "Error",
          mtsResponse.message || "Something went wrong.",
          "error"
        );
      } else {
        showToast(
          "Success",
          "You have successfully promoted this user to staff.",
          "success"
        );
        const [updatedUser, mtsResponse] = await getUserByFirebaseAuth(
          editUser
        );
        setEditUser(updatedUser);
      }
    } catch (e) {
      console.log(e);
      showToast("Error", "Something went wrong.", "error");
    } finally {
      setIsLoadingPromote(false);
    }
  };

  const onUpdateProfile = async () => {
    setIsLoadingSave(true);
    const copyAffiliate = {
      code: newAffiliateCode,
      lastChanged: new Date(),
    };

    const userUpdate = {
      uid: editUser?.uid,
      username: newUsername,
      photoURL: newPhotoURL,
      email: newEmail,
      title: { title: newTitle, color: color },
      referralCode: newReferralCode,
      affiliate: copyAffiliate,
      balance: newBalance,
    };

    try {
      const [res, mtsResponse] = await updateUser(
        authHeader,
        user,
        editUser.uid,
        userUpdate
      );
      if (mtsResponse) {
        showToast(
          "Error",
          mtsResponse.message || "Something went wrong.",
          "error"
        );
      } else {
        showToast(
          "Success",
          "You have successfully updated the profile.",
          "success"
        );
        const [updatedUser, mtsResponse] = await getUserByFirebaseAuth(
          editUser
        );
        setEditUser(updatedUser);
      }
    } catch (e) {
      showToast("Error", `Profile not updated. Error: ${e.message}`, "error");
    } finally {
      setIsLoadingSave(false);
    }

    if (editUser?.uid === user?.uid) {
      dispatch(setUsername(newUsername));
      dispatch(setProfilePicture(newPhotoURL));
      dispatch(setBalance(Number(newBalance)));
    }
  };

  const search_parameters = Object.keys(Object.assign({}, ...userList));

  const searchUsers = (userList) => {
    return userList
      .filter((data) => {
        return search_parameters.some((parameter) =>
          data[parameter]?.toString()?.toLowerCase()?.includes(search)
        );
      })
      .sort((a, b) => Number(b?.isStaff) - Number(a.isStaff))
      .sort((a, b) => Number(b?.isHighStaff) - Number(a.isHighStaff));
  };

  const determinStaffTags = (user) => {
    if (user?.isHighStaff) {
      return (
        <Tag size={"sm"} key={"sm"} variant="solid" colorScheme={"red"} m={1}>
          High Staff
        </Tag>
      );
    } else if (user?.isStaff) {
      return (
        <Tag
          size={"sm"}
          key={"sm"}
          variant="solid"
          colorScheme={"purple"}
          m={1}
        >
          Staff
        </Tag>
      );
    } else {
      return (
        <Tag size={"sm"} key={"sm"} variant="solid" colorScheme={"gray"} m={1}>
          Player
        </Tag>
      );
    }
  };

  const determinUsers = () => {
    if (!userList) {
      return (
        <div>
          <Text fontSize="3xl">Manage Users</Text>
          <Text color={"gray.400"}>(No current users)</Text>
        </div>
      );
    } else {
      return searchUsers(userList).map((user) => (
        <Card key={user?.uid} variant="solid" bg={bg} dropShadow={"lg"}>
          <CardBody>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <VStack alignItems={"center"} justifyContent={"center"} w={20}>
                  <Avatar size={"sm"} src={user?.photoURL}>
                    {user?.isOnline ? (
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    ) : (
                      <AvatarBadge boxSize="1.25em" bg="red.500" />
                    )}
                  </Avatar>
                  {determinStaffTags(user)}
                </VStack>
                <HStack>
                  <Hide below="md">
                    {user?.title?.title && (
                      <Tag
                        size={"sm"}
                        key={"sm"}
                        variant="solid"
                        colorScheme={user?.title?.color}
                        m={1}
                      >
                        {user?.title?.title}
                      </Tag>
                    )}
                  </Hide>
                  <Text noOfLines={1} fontSize="lg">
                    {user?.username ? user?.username : "User"}
                  </Text>
                </HStack>
              </Flex>
              <HStack alignItems={"center"} justifyContent={"space-between"}>
                <Hide below="md">{formatMoney(user?.balance)}</Hide>
                <IconButton
                  size={"md"}
                  icon={<SettingsIcon />}
                  aria-label={"Open Menu"}
                  variant={"ghost"}
                  onClick={() => setupEditedUser(user)}
                />
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      ));
    }
  };

  const setupEditedUser = (user) => {
    setEditUser(user);
    setSearch("");
    setColor(user?.title?.color ? user?.title?.color : "purple");
    setNewUsername(user?.username);
    setNewPhotoURL(user?.photoURL);
    setNewEmail(user?.email);
    setNewBalance(user?.balance);
    setNewTitle(user?.title?.title);
    setNewReferralCode(user?.referralCode);
    setNewAffiliateCode(user?.affiliate?.code);
  };

  const determinSearch = () => (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  );

  const determinEditUserScreen = () => (
    <div>
      <Button
        variant={"solid"}
        colorScheme={"teal"}
        size={"md"}
        mb={4}
        onClick={() => setEditUser(null)}
        leftIcon={<ChevronLeftIcon />}
      >
        Back
      </Button>
      <Stack mt={4}>
        <Card direction={{ base: "column" }} variant="solid">
          <CardHeader>{determinStaffTags(editUser)}</CardHeader>
          <Stack>
            {editUser.photoURL ? (
              <HStack alignItems={"center"} justifyContent={"space-evenly"}>
                <Avatar
                  size="md"
                  name={editUser?.newUsername}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={newPhotoURL ? newPhotoURL : editUser?.photoURL}
                  alt={newPhotoURL ? newPhotoURL : editUser?.photoURL}
                />
                <Avatar
                  size="xl"
                  name={editUser?.newUsername}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={newPhotoURL ? newPhotoURL : editUser?.photoURL}
                  alt={newPhotoURL ? newPhotoURL : editUser?.photoURL}
                />
                <Avatar
                  size="2xl"
                  name={editUser?.newUsername}
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  mt={2}
                  p={2}
                  borderRadius={25}
                  src={newPhotoURL ? newPhotoURL : editUser?.photoURL}
                  alt={newPhotoURL ? newPhotoURL : editUser?.photoURL}
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
                The maximum upload size is 200 KB. Accepted formats are jpg,
                png, and gif.
              </Text>
              <Stack mt={5}>
                <Text mb="8px">Photo URL</Text>
                <Input
                  value={newPhotoURL}
                  onChange={(event) => setNewPhotoURL(event.target.value)}
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
              <Stack mt={5}>
                <Text mb="8px">Email</Text>
                <Input
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="Email"
                  size="lg"
                />
              </Stack>
              <Stack mt={5}>
                <Text mb="8px">Referral Code</Text>
                <Input
                  value={newReferralCode}
                  onChange={(event) => setNewReferralCode(event.target.value)}
                  placeholder="Referral Code"
                  size="lg"
                />
              </Stack>
              <Stack mt={5}>
                <Text mb="8px">Affiliate Code</Text>
                <Input
                  value={newAffiliateCode}
                  onChange={(event) => setNewAffiliateCode(event.target.value)}
                  placeholder="Affiliate Code"
                  size="lg"
                />
              </Stack>
              <Stack mt={5}>
                {user?.isHighStaff && (
                  <>
                    <Heading size="md">Custom User Title</Heading>
                    <Flex alignItems={"center"} justifyContent={"flex-start"}>
                      <Avatar size={"md"} src={editUser?.photoURL} />
                      {newTitle && (
                        <Tag
                          size={"md"}
                          key={"sm"}
                          variant="solid"
                          colorScheme={color}
                          m={1}
                        >
                          {newTitle}
                        </Tag>
                      )}
                      <Text noOfLines={1} fontSize="lg" ml={1}>
                        {editUser?.username ? editUser?.username : "User"}
                      </Text>
                    </Flex>
                    <HStack>
                      <Input
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        placeholder="Give this user a title."
                        size="md"
                      />
                      <Center>
                        <ColorPicker color={color} setColor={setColor} />
                      </Center>
                    </HStack>
                  </>
                )}
              </Stack>
              {user?.isHighStaff && (
                <Stack mt={5}>
                  <Text mb="8px">Balance</Text>
                  <Input
                    value={newBalance}
                    onChange={(event) => setNewBalance(event.target.value)}
                    placeholder="Balance"
                    size="lg"
                  />
                </Stack>
              )}
              <HStack
                mt={5}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                  justifyContent={{ base: "flex-start", md: "flex-end" }}
                  alignItems={{ base: "stretch", md: "center" }}
                  width="100%"
                >
                  <Box
                    width={{ base: "100%", md: "auto" }}
                    alignSelf="flex-start"
                    marginRight={{ base: 0, md: "auto" }}
                  >
                    <Button
                      variant="solid"
                      colorScheme="teal"
                      width="100%"
                      mb={{ base: 2, md: 0 }}
                      onClick={() => onUpdateProfile()}
                      isLoading={isLoadingSave}
                      isDisabled={isLoadingSave}
                    >
                      Save
                    </Button>
                  </Box>

                  {!user?.isHighStaff && editUser?.isStaff ? (
                    <></>
                  ) : user?.isStaff && editUser?.banned?.isBanned ? (
                    <Button
                      variant="outline"
                      colorScheme="red"
                      width={{ base: "100%", md: "auto" }}
                      mb={{ base: 2, md: 0 }}
                    >
                      Unban
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      colorScheme="red"
                      width={{ base: "100%", md: "auto" }}
                      mb={{ base: 2, md: 0 }}
                    >
                      Ban
                    </Button>
                  )}
                  {user?.isHighStaff && (
                    <>
                      {editUser?.isStaff ? (
                        !editUser?.isHighStaff && (
                          <Button
                            variant="outline"
                            colorScheme="red"
                            ml={{ base: 0, md: 2 }}
                            onClick={() => demoteToPlayer(editUser)}
                            isLoading={isLoadingDemote}
                            isDisabled={isLoadingDemote}
                            width={{ base: "100%", md: "auto" }}
                            mb={{ base: 2, md: 0 }}
                          >
                            Demote To Player
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="outline"
                          colorScheme="yellow"
                          ml={{ base: 0, md: 2 }}
                          onClick={() => promoteToStaff(editUser)}
                          isLoading={isLoadingPromote}
                          isDisabled={isLoadingPromote}
                          width={{ base: "100%", md: "auto" }}
                          mb={{ base: 2, md: 0 }}
                        >
                          Promote To Staff
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        colorScheme="red"
                        ml={{ base: 0, md: 2 }}
                        width={{ base: "100%", md: "auto" }}
                      >
                        Delete User
                      </Button>
                    </>
                  )}
                </Box>
              </HStack>
            </CardBody>
          </Stack>
        </Card>
      </Stack>
    </div>
  );

  return (
    <Stack>
      {editUser ? (
        <HStack>
          <Text fontSize="3xl" noOfLines={1}>
            Editing
          </Text>
          {editUser?.title?.title && (
            <Tag
              size={"sm"}
              key={"sm"}
              variant="solid"
              colorScheme={editUser?.title?.color}
            >
              {editUser?.title?.title}
            </Tag>
          )}
          <Text fontSize="2xl" noOfLines={1}>
            {editUser?.username ? editUser?.username : "User"}
          </Text>
        </HStack>
      ) : (
        <Text fontSize="3xl">Manage Users</Text>
      )}
      <Divider />
      {editUser ? (
        <Stack mt={5}>{determinEditUserScreen()}</Stack>
      ) : (
        <div>
          <Stack mt={10}>{determinSearch()}</Stack>
          <Stack mt={5}>{determinUsers()}</Stack>
        </div>
      )}
    </Stack>
  );
}
