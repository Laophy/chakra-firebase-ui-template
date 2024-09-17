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
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  AddIcon,
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
      icon: GrArticle,
      color: "gray",
    },
    { to: "Battles", path: "battles", icon: GrConnect, color: "gold" },
    // { to: "Cart", path: "cart", icon: GrCart, color: "gray" },
    { to: "Rewards", path: "rewards", icon: GrInstall, color: "orange" },
  ];

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
              {/* <Button variant={"ghost"} onClick={toggleColorMode} mr={4}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button> */}

              {user ? (
                <>
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
        <Box>
          <Container as={Stack} minHeight={"75vh"} maxW={"7xl"} py={2}>
            {websiteContent}
          </Container>
        </Box>
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
