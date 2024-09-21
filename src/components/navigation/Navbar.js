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
  SimpleGrid,
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
import { LuBox } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiHouseBold } from "react-icons/pi";
import { useState } from "react";
import ChatBox from "../chat/ChatBox";
import { FaHouse, FaShieldAlt } from "react-icons/fa";

export default function Navbar({ websiteContent }) {
  const user = useSelector((state) => state.data.user.user);
  const toast = useToast();
  const dispatch = useDispatch();

  const [isChatOpen, setIsChatOpen] = useState(false);

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
    base: "",
    sm: applicationDetails.shortName,
    md: applicationDetails.shortName,
    lg: applicationDetails.name,
  });

  const onLogoutUser = () => {
    dispatch(loginUser());
    signOut(auth);
    toast({
      title: "Success",
      description: "You have successfully signed out.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const Links = [
    {
      to: "Home",
      path: "/",
      icon: PiHouseBold,
      color: "white",
    },
    {
      to: "Boxes",
      path: "boxes",
      icon: LuBox,
      color: "white",
    },
    {
      to: "Box Battles",
      path: "battles",
      icon: FaShieldAlt,
      color: "orange",
    },
    {
      to: "Inventory",
      path: "inventory",
      icon: MdOutlineInventory2,
      color: "white",
    },
  ];

  const NavLink = ({ children }) => {
    const showIcon = useBreakpointValue({
      base: false,
      sm: false,
      md: false,
      lg: true,
    });
    return (
      <Link to={children.path}>
        <Button
          variant={"ghost"}
          size={"sm"}
          mr={1}
          leftIcon={showIcon ? <children.icon color={children.color} /> : null}
        >
          {children.to}
        </Button>
      </Link>
    );
  };

  const NavLinkMobile = ({ children }) => (
    <Link to={children.path}>
      <Button
        variant={"ghost"}
        size={"lg"}
        onClick={() => onClose()}
        leftIcon={<children.icon color={children.color} />}
      >
        {children.to}
      </Button>
    </Link>
  );

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

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
              {user ? (
                <>
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
              {user && (
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
              )}
            </Flex>
          </Flex>

          {isOpen && (
            <Box pb={4} display={{ md: "none" }} sx={{ textAlign: "center" }}>
              <Stack as={"nav"} spacing={4} sx={fullscreenbanner}>
                {Links.map((link) => (
                  <NavLinkMobile key={link.to}>{link}</NavLinkMobile>
                ))}
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
      <Container maxW={"7xl"} alignItems={"center"} justifyContent={"center"}>
        <SimpleGrid
          templateColumns={{ base: "4fr", md: isChatOpen ? "4fr 1fr" : "1fr" }}
        >
          {isChatOpen && isMobile ? null : (
            <Container
              as={Stack}
              minHeight={"75vh"}
              maxW={isChatOpen ? "3xl" : "7xl"}
              py={2}
            >
              {websiteContent}
            </Container>
          )}
          {isChatOpen && (
            <Container as={Stack} minHeight={"75vh"} maxW={"md"} py={2}>
              <ChatBox user={user} />
            </Container>
          )}
        </SimpleGrid>
      </Container>
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
