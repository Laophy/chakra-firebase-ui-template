import {
  Avatar,
  Box,
  Flex,
  Text,
  Container,
  SimpleGrid,
  Menu,
  MenuItem,
  Stack,
  Tag,
  Icon,
  useColorModeValue,
  MenuGroup,
  Button,
  MenuButton,
  MenuList,
  MenuDivider, // Import MenuDivider
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useBreakpointValue } from "@chakra-ui/media-query";
import {
  FaUser,
  FaMoneyCheck,
  FaHistory,
  FaShieldAlt,
  FaUsers,
  FaCogs,
  FaChevronDown,
} from "react-icons/fa";
import React from "react";

export default function Account({ pageElement, currentPage }) {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const menuItems = [
    {
      label: "Profile",
      icon: FaUser,
      path: "/account/profile",
      category: "Account",
    },
    {
      label: "Deposits",
      icon: FaMoneyCheck,
      path: "/account/deposits",
      category: "Account",
    },
    {
      label: "Withdrawals", // Fixed typo
      icon: FaMoneyCheck,
      path: "/account/withdrawals", // Fixed typo
      category: "Account",
    },
    {
      label: "Claims",
      icon: FaMoneyCheck,
      path: "/account/claims",
      category: "Account",
    },
    {
      label: "Sales",
      icon: FaMoneyCheck,
      path: "/account/sales",
      category: "Account",
    },
    {
      label: "History",
      icon: FaHistory,
      path: "/account/history",
      category: "Account",
    },
    {
      label: "Affiliate",
      icon: FaUsers,
      path: "/account/affiliate",
      category: "Account",
    },
    {
      label: "Executive Panel",
      icon: FaCogs,
      path: "/account/highadminpanel",
      highAdmin: true,
      category: "Admin",
    },
    {
      label: "Users",
      icon: FaUsers,
      path: "/account/adminusers",
      admin: true,
      category: "Admin",
    },

    {
      label: "Fairness",
      icon: FaShieldAlt,
      path: "/account/fairness",
      category: "Settings",
    },
    {
      label: "Security",
      icon: FaShieldAlt,
      path: "/account/security",
      category: "Settings",
    },
  ];

  const selectedBg = useColorModeValue("blue.100", "blue.700");

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div>
      <Container as={Stack} maxW={"6xl"}>
        <Stack>
          <SimpleGrid
            templateColumns={{ base: "1fr", md: "1fr 4fr" }}
            spacing={4}
          >
            <Box>
              {isMobile ? (
                <Menu>
                  <MenuButton
                    variant={"solid"}
                    colorScheme={"gray"}
                    as={Button}
                    rightIcon={<FaChevronDown />}
                  >
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                  </MenuButton>
                  <MenuList>
                    {categories.map((category, index) => (
                      <React.Fragment key={category}>
                        {index > 0 && <MenuDivider />}{" "}
                        {/* Add divider between categories */}
                        {menuItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <MenuItem
                              key={item.label}
                              onClick={() => navigate(item.path)}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                      </React.Fragment>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <Menu>
                  <MenuItem minH="48px">
                    <Flex
                      alignItems={"center"}
                      justifyContent={{ base: "center", md: "space-between" }}
                    >
                      <Avatar size={"sm"} mr="12px" src={user?.photoURL} />
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
                      <Text noOfLines={1} fontSize="lg">
                        {user?.username || "User"}
                      </Text>
                    </Flex>
                  </MenuItem>
                  {categories.map((category) => {
                    if (
                      (category === "Admin" && !user?.isStaff) ||
                      (category === "Admin" && !user?.isHighStaff)
                    ) {
                      return null;
                    }
                    return (
                      <MenuGroup
                        key={category}
                        title={category}
                        fontSize="xl"
                        fontWeight="bold"
                        mb={2}
                      >
                        {menuItems
                          .filter((item) => item.category === category)
                          .map((item) => {
                            if (
                              (item.admin && !user?.isStaff) ||
                              (item.highAdmin && !user?.isHighStaff)
                            ) {
                              return null;
                            }
                            const isSelected = currentPage === item.path;
                            return (
                              <Link to={item.path} key={item.label}>
                                <MenuItem
                                  borderRadius="10px" // Ensure rounded corners always
                                  bg={isSelected ? selectedBg : "transparent"} // Highlight selected option
                                  _hover={{
                                    bg: selectedBg,
                                    borderRadius: "10px",
                                  }} // Hover effect
                                  _focus={{
                                    boxShadow: "none",
                                    borderRadius: "10px",
                                  }} // Remove focus outline and ensure rounded corners
                                  p={3} // Added padding for better spacing
                                  ml={4} // Offset tabs to the right
                                >
                                  <Flex alignItems="center">
                                    <Icon as={item.icon} mr={3} />
                                    <Text fontSize="md">{item.label}</Text>{" "}
                                    {/* Reduced font size */}
                                  </Flex>
                                </MenuItem>
                              </Link>
                            );
                          })}
                      </MenuGroup>
                    );
                  })}
                </Menu>
              )}
            </Box>
            <Stack width="100%" ml={2}>
              {pageElement}
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  );
}
