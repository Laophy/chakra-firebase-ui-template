import { Text, Divider, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Fairness() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Stack>
      {!isMobile && <Text fontSize="3xl">Fairness</Text>}
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Game Fairness</Text>
        <Text color={"gray.400"}>(Verify Previous Game Seeds)</Text>
      </Stack>
    </Stack>
  );
}
