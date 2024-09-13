import { Search2Icon } from "@chakra-ui/icons";
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
  CardFooter,
  CircularProgress,
  Image,
  SimpleGrid,
  PopoverBody,
  Center,
  PopoverHeader,
  PopoverCloseButton,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useToast,
  Popover,
  Th,
  Tr,
  Tfoot,
  Td,
  Tbody,
  Thead,
  Table,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllUserData,
  updateUser,
} from "../../../services/UserManagement.service";

export default function AdminViewUsers() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const toast = useToast();

  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const [newUsername, setNewUsername] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newBalance, setNewBalance] = useState(null);
  const [newTitle, setNewTitle] = useState(null);

  const [color, setColor] = useState("yellow");

  const colors = [
    "gray",
    "red",
    "gray",
    "green",
    "blue",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
  ];

  useEffect(() => {
    // Get users (will need to reduce this at some point when there are tons of users)
    initAllUserData();
  }, [editUser]);

  const initAllUserData = async () => {
    const [allUsers, mtsRes] = await getAllUserData();
    if (allUsers) {
      setUserList(allUsers);
    }
  };

  const onUpdateProfile = async () => {
    const userUpdate = {
      username: newUsername,
      photoURL: photoURL,
      email: newEmail,
      title: { title: newTitle, color: color },
      balance: newBalance,
    };

    try {
      const [res, mtsRes] = await updateUser(editUser.uid, userUpdate);
      if (res) {
        toast({
          title: "Success",
          description: "You have successfuly updated the profile.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
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

  const search_parameters = Object.keys(Object.assign({}, ...userList));

  const searchUsers = (userList) => {
    return userList.filter((data) => {
      return search_parameters.some((parameter) =>
        data[parameter].toString().toLowerCase().includes(search)
      );
    });
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
      return searchUsers(userList).map((user) => {
        return (
          <Card>
            <CardBody>
              <HStack alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Avatar size={"sm"} mr="12px" src={user?.photoURL} />
                  <Text noOfLines={1} fontSize="lg">
                    <span
                      style={{ color: user?.title.color }}
                    >{`${user?.title.title} `}</span>
                    {user?.username ? user?.username : "User"}
                  </Text>
                </Flex>
                <Text>{user.email}</Text>
                <Text>${user.balance}</Text>
                <Button
                  variant="outline"
                  colorScheme={"teal"}
                  size={"sm"}
                  onClick={() => setupEditedUser(user)}
                >
                  Edit
                </Button>
              </HStack>
            </CardBody>
          </Card>
        );
      });
      // return (
      //   <TableContainer>
      //     <Table size="sm">
      //       <Thead>
      //         <Tr>
      //           <Th>Username</Th>
      //           <Th>Email</Th>
      //           <Th isNumeric>Balance</Th>
      //         </Tr>
      //       </Thead>
      //       <Tbody>
      //         <Tr>
      //           <Td>{userList[0]?.username}</Td>
      //           <Td>{userList[0]?.email}</Td>
      //           <Td isNumeric>{userList[0]?.balance}</Td>
      //         </Tr>
      //       </Tbody>
      //     </Table>
      //   </TableContainer>
      // );
    }
  };

  const setupEditedUser = (user) => {
    setEditUser(user);
    setSearch("");
    setColor(user?.title?.color);
    setNewUsername(user?.username);
    setPhotoURL(user?.photoURL);
    setNewEmail(user?.email);
    setNewBalance(user?.balance);
    setNewTitle(user?.title?.title);
  };

  const determinSearch = () => {
    return (
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
  };

  const determinEditUserScreen = () => {
    return (
      <div>
        <Button
          variant={"outline"}
          colorScheme={"teal"}
          size={"md"}
          mb={4}
          onClick={() => setEditUser(null)}
        >
          Back
        </Button>
        <Stack mt={4}>
          <Card direction={{ base: "column" }} variant="outline">
            <Stack>
              {editUser.photoURL ? (
                <Image
                  objectFit="contain"
                  maxW={{ base: "100%" }}
                  m={5}
                  p={2}
                  mr={"auto"}
                  ml={"auto"}
                  borderRadius={25}
                  src={editUser?.photoURL}
                  alt={editUser?.username}
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
                  {user?.isHighStaff && (
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text mb="8px">Title</Text>
                      <Input
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        placeholder="Title"
                        size="lg"
                      />
                      <Center>
                        <Popover variant="picker">
                          <PopoverTrigger>
                            <Button
                              aria-label={color}
                              background={color}
                              height="22px"
                              width="22px"
                              padding={0}
                              minWidth="unset"
                              borderRadius={3}
                            ></Button>
                          </PopoverTrigger>
                          <PopoverContent width="170px">
                            <PopoverArrow bg={color} />
                            <PopoverCloseButton color="white" />
                            <PopoverHeader
                              height="100px"
                              backgroundColor={color}
                              borderTopLeftRadius={5}
                              borderTopRightRadius={5}
                              color="white"
                            >
                              <Center height="100%">{color}</Center>
                            </PopoverHeader>
                            <PopoverBody height="120px">
                              <SimpleGrid columns={5} spacing={2}>
                                {colors.map((c) => (
                                  <Button
                                    key={c}
                                    aria-label={c}
                                    background={c}
                                    height="22px"
                                    width="22px"
                                    padding={0}
                                    minWidth="unset"
                                    borderRadius={3}
                                    _hover={{ background: c }}
                                    onClick={() => {
                                      setColor(c);
                                    }}
                                  ></Button>
                                ))}
                              </SimpleGrid>
                              <Input
                                borderRadius={3}
                                marginTop={3}
                                placeholder="red.100"
                                size="sm"
                                value={color}
                                onChange={(e) => {
                                  setColor(e.target.value);
                                }}
                              />
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Center>
                    </HStack>
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
              </CardBody>
              <CardFooter>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    onClick={() => onUpdateProfile()}
                  >
                    Save
                  </Button>
                  {user?.isHighStaff && (
                    <>
                      <Button variant="outline" colorScheme="yellow">
                        Ban User
                      </Button>
                      <Button variant="outline" colorScheme="red">
                        Delete User
                      </Button>
                    </>
                  )}
                </HStack>
              </CardFooter>
            </Stack>
          </Card>
        </Stack>
      </div>
    );
  };

  return (
    <Stack>
      {editUser ? (
        <Text fontSize="3xl" noOfLines={1}>
          Editing{" "}
          <span
            style={{ color: editUser?.title.color }}
          >{`${editUser?.title.title} `}</span>
          {editUser?.username ? editUser?.username : "User"}
        </Text>
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
