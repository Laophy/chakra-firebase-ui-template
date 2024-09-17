import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { applicationDetails, constants } from "../../utilities/constants";

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                {applicationDetails.name}
              </Text>
            </Box>
            <Text fontSize={"sm"}>{applicationDetails.description}</Text>
            <Stack direction={"row"} spacing={6}>
              <Link
                to={applicationDetails.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialButton label={"Twitter"}>
                  <FaTwitter />
                </SocialButton>
              </Link>
              <Link
                to={applicationDetails.links.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialButton label={"Discord"}>
                  <FaDiscord />
                </SocialButton>
              </Link>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Games</ListHeader>
            <Link to={"/packs"}>Packs</Link>
            <Link to={"/battles"}>Battles</Link>
            <Link to={"/rewards"}>Rewards</Link>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Community</ListHeader>
            <Link
              to={applicationDetails.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box>Twitter</Box>
            </Link>
            <Link
              to={applicationDetails.links.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Link>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Legal</ListHeader>
            <Link to={"/account/privacypolicy"}>Privacy Policy</Link>
            <Link to={"/account/terms"}>Terms of Service</Link>
          </Stack>
        </SimpleGrid>
        <Box
          mt={5}
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align={{ base: "center", md: "center" }}
          >
            <Text fontSize={"sm"}>{applicationDetails.copywrite}</Text>
            <Stack direction={"row"} spacing={6}>
              <Text fontSize={"sm"} as={"em"}>
                {applicationDetails.contact.email}
              </Text>
            </Stack>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}
