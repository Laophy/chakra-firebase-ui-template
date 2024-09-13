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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { loginUser } from "../../redux/userSlice";
import { applicationDetails, constants } from "../../utilities/constants";

export default function Navbar({ websiteContent }) {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  const toast = useToast();
  const dispatch = useDispatch();

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    { to: "Dashboard", path: "dashboard" },
    { to: "Battles", path: "battles" },
    { to: "Cart", path: "cart" },
    { to: "Rewards", path: "rewards" },
  ];

  const NavLink = (props) => {
    const { children } = props;
    return (
      <Link to={children.path}>
        <Button variant={"ghost"} colorScheme={"teal"} size={"sm"} mr={1}>
          {children.to}
        </Button>
      </Link>
    );
  };

  const NavLinkMobile = (props) => {
    const { children } = props;
    return (
      <Link to={children.path}>
        <Button
          variant={"ghost"}
          colorScheme={"teal"}
          size={"lg"}
          onClick={() => onClose()}
        >
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

  return (
    <>
      <Box px={8}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant={"ghost"}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight={800} fontSize={"22px"}>
              {applicationDetails.shortName}
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
              <Box>
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                >
                  ${user?.balance ? user?.balance.toFixed(2) : "0.00"}
                </Button>
              </Box>
            ) : (
              <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Link to={"/account/login"}>
                  <Button
                    variant={"outline"}
                    colorScheme={"teal"}
                    size={"sm"}
                    mr={4}
                  >
                    Login
                  </Button>
                </Link>
                <Link to={"/account/register"}>
                  <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    size={"sm"}
                    mr={4}
                  >
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
                  <Avatar size={"sm"} src={user?.photoURL} />
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
      </Box>
      {isOpen ? (
        ""
      ) : (
        <Box p={4} minH={"70vh"}>
          {websiteContent}
        </Box>
      )}
    </>
  );
}
