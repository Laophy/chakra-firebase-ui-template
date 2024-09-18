import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorMode,
  Stack,
  useToast,
  ButtonGroup,
  useBreakpointValue,
  useColorModeValue,
  Container,
  VStack,
  Input,
  Divider,
  Center,
  Tag,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  AddIcon,
  ChatIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { loginUser } from "../../redux/userSlice";
import { applicationDetails } from "../../utilities/constants";
import DepositFundsModal from "../modal/DepositFundsModal";
import CartModal from "../modal/CartModal";
import { formatMoney } from "../../utilities/Formatter";
import {
  FaTachometerAlt,
  FaBattleNet,
  FaShoppingCart,
  FaGift,
} from "react-icons/fa";
import {
  GrArticle,
  GrCart,
  GrConnect,
  GrGift,
  GrInstall,
  GrMoney,
} from "react-icons/gr";
import {
  GiCrossedSwords,
  GiDiceSixFacesSix,
  GiOpenChest,
} from "react-icons/gi";
import { useState, useEffect, useRef, Fragment } from "react";

export default function Navbar({ websiteContent }) {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  const toast = useToast();
  const dispatch = useDispatch();

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDepositOpen,
    onOpen: onDepositOpen,
    onClose: onDepsoitClose,
  } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const displayName = useBreakpointValue({
    base: applicationDetails.shortName,
    lg: applicationDetails.name,
  });

  const onLogoutUser = () => {
    dispatch(loginUser());
    signOut(auth);
    toast({
      title: "Success",
      description: "You have successfuly signed out.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const Links = [
    {
      to: "Dashboard",
      path: "dashboard",
      icon: GiDiceSixFacesSix,
      color: "white",
    },
    { to: "Battles", path: "battles", icon: GiCrossedSwords, color: "yellow" },
    // { to: "Cart", path: "cart", icon: GrCart, color: "gray" },
    { to: "Rewards", path: "rewards", icon: GiOpenChest, color: "white" },
  ];

  const bg = useColorModeValue("gray.100", "gray.700");
  const bgReverse = useColorModeValue("gray.300", "gray.500");

  const NavLink = (props) => {
    const { children } = props;
    return (
      <Link to={children.path}>
        <Button
          variant={"ghost"}
          size={"sm"}
          mr={1}
          leftIcon={<children.icon color={children.color} />}
        >
          {children.to}
        </Button>
      </Link>
    );
  };

  const NavLinkMobile = (props) => {
    const { children } = props;
    return (
      <Link to={children.path}>
        <Button variant={"ghost"} size={"lg"} onClick={() => onClose()}>
          {children.to}
        </Button>
      </Link>
    );
  };

  const fullscreenbanner = {
    justifyContent: "center",
    alignItems: "center",
    background: "var(--chakra-colors-chakra-body-bg)",
    display: "flex",
    zIndex: "100",
    position: "fixed",
    top: "var(--chakra-space-16)",
    left: "0px",
    right: "0px",
    bottom: "0px",
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      text: newMessage,
      photoURL: user?.photoURL,
      title: user?.title,
      username: user?.username,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box color={useColorModeValue("gray.700", "gray.200")}>
        <Container as={Stack} maxW={"6xl"} py={8}>
          <Flex h={1} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
              variant={"ghost"}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box fontWeight={800} fontSize="22px">
                {displayName}
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link.to}>{link}</NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Button variant={"ghost"} onClick={toggleColorMode} mr={4}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              {user ? (
                <>
                  <Button
                    onClick={toggleChat}
                    variant={"ghost"}
                    colorScheme={isChatOpen ? "red" : "teal"}
                    size={"sm"}
                    mr={2}
                    aria-label="Toggle Chat"
                  >
                    {isChatOpen ? <CloseIcon /> : <ChatIcon />}
                  </Button>
                  <Button
                    variant={"ghost"}
                    colorScheme={"gray"}
                    size={"sm"}
                    mr={2}
                    leftIcon={<GrCart />}
                    onClick={() => onCartOpen()}
                  >
                    Cart
                  </Button>
                  <ButtonGroup m={2} size="sm" isAttached variant="outline">
                    <Button size={"sm"}>{formatMoney(user?.balance)}</Button>
                    <IconButton
                      onClick={onDepositOpen}
                      aria-label="Add money"
                      icon={<AddIcon />}
                    />
                  </ButtonGroup>
                </>
              ) : (
                <Flex
                  h={16}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Link to={"/account/login"}>
                    <Button variant={"outline"} size={"sm"} mr={4}>
                      Login
                    </Button>
                  </Link>
                  <Link to={"/account/register"}>
                    <Button variant={"solid"} size={"sm"} mr={4}>
                      Register
                    </Button>
                  </Link>
                </Flex>
              )}
              {user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={user?.photoURL} ml={2} />
                  </MenuButton>
                  <MenuList>
                    <Link to={"/account/profile"}>
                      <MenuItem minH="48px">
                        <Flex
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Avatar
                            size={"sm"}
                            borderRadius="full"
                            mr="12px"
                            src={user?.photoURL}
                          />
                          <Text noOfLines={1} fontSize="lg">
                            {user?.username ? user?.username : "User"}
                          </Text>
                        </Flex>
                      </MenuItem>
                    </Link>
                    <MenuDivider />
                    <Link to={"/account/deposits"}>
                      <MenuItem>Deposits</MenuItem>
                    </Link>
                    <Link to={"/account/withdrawls"}>
                      <MenuItem>Withdrawls</MenuItem>
                    </Link>
                    <Link to={"/account/claims"}>
                      <MenuItem>Claims</MenuItem>
                    </Link>
                    <Link to={"/account/sales"}>
                      <MenuItem>Sales</MenuItem>
                    </Link>
                    <Link to={"/account/history"}>
                      <MenuItem>History</MenuItem>
                    </Link>
                    <Link to={"/account/affiliate"}>
                      <MenuItem>Affiliate</MenuItem>
                    </Link>
                    <Link to={"/account/fairness"}>
                      <MenuItem>Fairness</MenuItem>
                    </Link>
                    <Link to={"/account/security"}>
                      <MenuItem>Security</MenuItem>
                    </Link>
                    <MenuDivider />
                    <Link to={"/"} onClick={() => onLogoutUser()}>
                      <MenuItem sx={{ fontWeight: "bold" }}>Sign Out</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>
              ) : (
                <></>
              )}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }} sx={{ textAlign: "center" }}>
              <Stack as={"nav"} spacing={4} style={fullscreenbanner}>
                {Links.map((link) => (
                  <NavLinkMobile key={link.to}>{link}</NavLinkMobile>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
      {isOpen ? (
        ""
      ) : (
        <Flex>
          {isChatOpen && isMobile ? (
            ""
          ) : (
            <Container as={Stack} minHeight={"75vh"} maxW={"7xl"} py={2}>
              {websiteContent}
            </Container>
          )}
          {isChatOpen && (
            <Container
              as={Stack}
              minHeight={"75vh"}
              maxW={isMobile ? "100%" : "sm"}
              py={2}
            >
              <VStack display={{ base: "flex", md: "flex" }} h={"75vh"}>
                <Box
                  ref={chatContainerRef}
                  flex="1"
                  overflowY="auto"
                  w={"100%"}
                  maxH={"70vh"}
                  bg={bg}
                  borderRadius="md"
                  css={{
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                  }}
                >
                  {messages.map((message, index) => (
                    <Flex key={index} align="center" mb={2} m={3}>
                      <Avatar size="sm" src={message.photoURL} mr={2} />
                      <Box>
                        <HStack>
                          <Tag
                            size={"sm"}
                            key={"sm"}
                            variant="solid"
                            colorScheme={message?.title?.color}
                            m={0.5}
                          >
                            {message?.title?.title}
                          </Tag>
                          <Text noOfLines={1} fontSize="md">
                            {message?.username ? message?.username : "User"}
                          </Text>
                        </HStack>
                        <Box
                          bg={bgReverse}
                          p={2}
                          borderRadius="md"
                          maxW={"250px"}
                        >
                          <Text fontSize={"sm"}>{message.text}</Text>
                        </Box>
                      </Box>
                    </Flex>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
                <Box w="100%" display="flex" p={2}>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <Button onClick={handleSendMessage} ml={2}>
                    Send
                  </Button>
                </Box>
              </VStack>
            </Container>
          )}
        </Flex>
      )}
      <DepositFundsModal
        isDepositOpen={isDepositOpen}
        onDepositOpen={onDepositOpen}
        onDepsoitClose={onDepsoitClose}
      />
      <CartModal
        isCartOpen={isCartOpen}
        onCartOpen={onCartOpen}
        onCartClose={onCartClose}
      />
    </>
  );
}
