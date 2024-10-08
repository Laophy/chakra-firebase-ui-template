import { Flex, Container, SimpleGrid, Stack, Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Rewards() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Container as={Stack} maxW={"7xl"}>
      <Stack alignItems={"center"} justifyContent={"space-between"}>
        <Flex>
          <Heading as="h3" size="lg">
            Rewards
          </Heading>
        </Flex>
      </Stack>
      <SimpleGrid minChildWidth="275px" spacing={4} mt={5}></SimpleGrid>
    </Container>
  );
}
