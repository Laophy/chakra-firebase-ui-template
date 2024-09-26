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
  Stack,
  useToast,
  ButtonGroup,
  useBreakpointValue,
  useColorModeValue,
  Container,
  SimpleGrid,
  VStack,
  Card,
  CardBody,
  Image,
  Heading,
  Divider,
  CardFooter,
  Tag,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon, ChatIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { loginUser } from "../../redux/userSlice";
import { applicationDetails } from "../../utilities/constants";
import DepositFundsModal from "../modal/DepositFundsModal";
import CartModal from "../modal/CartModal";
import { formatMoney } from "../../utilities/Formatter";
import { LuBox, LuSword } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiHouseBold } from "react-icons/pi";
import { useState } from "react";
import ChatBox from "../chat/ChatBox";
import { FaBoxOpen, FaHouse, FaShieldAlt } from "react-icons/fa";

export default function Navbar({ websiteContent }) {
  const user = useSelector((state) => state.data.user.user);
  const toast = useToast();
  const dispatch = useDispatch();

  const [isChatOpen, setIsChatOpen] = useState(false);

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
      color: "white", // Force dark mode color
    },
    {
      to: "Boxes",
      path: "boxes",
      icon: LuBox,
      color: "white", // Force dark mode color
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
      color: "white", // Force dark mode color
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
        <Container as={Stack} maxW={"7xl"} py={8}>
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
                    <MenuItem as={Link} to={"/account/profile"} minH="48px">
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
                    <MenuDivider />
                    <MenuItem as={Link} to={"/account/deposits"}>
                      Deposits
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/withdrawls"}>
                      Withdrawls
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/claims"}>
                      Claims
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/sales"}>
                      Sales
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/history"}>
                      History
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/affiliate"}>
                      Affiliate
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/fairness"}>
                      Fairness
                    </MenuItem>
                    <MenuItem as={Link} to={"/account/security"}>
                      Security
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      as={Link}
                      to={"/"}
                      onClick={() => onLogoutUser()}
                      sx={{ fontWeight: "bold" }}
                    >
                      Sign Out
                    </MenuItem>
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
      <HStack maxW="full" px={0} alignItems="top">
        <Container
          w="xs"
          alignItems="top"
          justifyContent="center"
          px={0}
          borderRadius="md"
          display={{ base: "none", xl: "flex" }}
        >
          <VStack spacing={4} overflowY="auto" width="100%" p={4}>
            {[...Array(5)].map((_, index) => {
              const randomPokemonId = Math.floor(Math.random() * 102) + 1;
              const randomName = ["Alice", "Bob", "Charlie", "David", "Emma"][
                Math.floor(Math.random() * 5)
              ];

              return (
                <Card key={index} maxW="sm" width="100%" position="relative">
                  <Box position="absolute" top={2} left={2} zIndex={1}>
                    <Tag size="md" variant="solid" colorScheme="red">
                      🔥 Fire
                    </Tag>
                  </Box>
                  <CardBody>
                    <Flex justifyContent="center" alignItems="center">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonId}.png`}
                        alt={`Pokémon #${randomPokemonId}`}
                        borderRadius="lg"
                        boxSize="200px"
                        objectFit="contain"
                      />
                    </Flex>
                    <Stack mt="4" spacing="3">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="md">{`Pokémon #${randomPokemonId}`}</Heading>
                        <Text fontWeight="bold" color="gray.500">
                          {randomName}
                        </Text>
                      </Flex>
                      <Text>
                        Congratulations! They have won a rare Base Set Pokémon
                        card!
                      </Text>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    {(() => {
                      const isViewBattle = Math.random() < 0.5;
                      return (
                        <Button
                          variant="solid"
                          colorScheme={isViewBattle ? "blue" : "yellow"}
                          width="100%"
                          leftIcon={
                            isViewBattle ? (
                              <Icon as={LuSword} />
                            ) : (
                              <Icon as={FaBoxOpen} />
                            )
                          }
                        >
                          {isViewBattle ? "View Battle" : "Open Box"}
                        </Button>
                      );
                    })()}
                  </CardFooter>
                </Card>
              );
            })}
          </VStack>
        </Container>
        <Container maxW="7xl" alignItems="top" justifyContent="center" px={0}>
          <Flex direction={{ base: "column", md: "row" }} width="100%">
            <Box
              flex={isChatOpen ? { base: "1", md: "3" } : "1"}
              minHeight="75vh"
              py={2}
              display={{
                base: isChatOpen ? "none" : "block",
                md: "block",
              }}
            >
              {websiteContent}
            </Box>
            {isChatOpen && isMobile && (
              <Box
                top={{ base: "0", md: "0" }}
                right={{ base: "0", md: "0" }}
                height={{ base: "auto", md: "100vh" }}
                width={{ base: "100%", md: "300px" }}
                display="flex"
                flexDirection="column"
              >
                <ChatBox
                  user={user}
                  isChatOpen={isChatOpen}
                  setIsChatOpen={setIsChatOpen}
                />
              </Box>
            )}
          </Flex>
        </Container>
        <Container
          w="xs"
          alignItems="top"
          justifyContent="center"
          px={0}
          borderRadius="md"
          display={{ base: "none", md: "flex", xl: "flex" }}
        >
          {isChatOpen && (
            <Box
              top={{ base: "0", md: "0" }}
              right={{ base: "0", md: "0" }}
              height={{ base: "auto", md: "100vh" }}
              width={{ base: "100%", md: "300px" }}
              display="flex"
              flexDirection="column"
            >
              <ChatBox
                user={user}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            </Box>
          )}
        </Container>
      </HStack>
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
