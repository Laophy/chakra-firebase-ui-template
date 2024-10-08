import { Search2Icon } from "@chakra-ui/icons";
import {
  Flex,
  Container,
  Button,
  InputLeftElement,
  InputGroup,
  Input,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Inventory() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Container as={Stack} maxW={"7xl"}>
      <Stack
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        flexDirection={"row"}
      >
        <Heading as="h3" size="lg">
          Inventory
        </Heading>
        <Flex>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input type="text" placeholder="Search" />
          </InputGroup>
          <Link to={"/cart"}>
            <Button variant={"solid"} size={"md"} ml={4}>
              Sell Selected
            </Button>
          </Link>
        </Flex>
      </Stack>
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="4xl">Inventory Items</Text>
        <Text color={"gray.400"}>(Your Inventory is empty)</Text>
      </Stack>
    </Container>
  );
}
