import { Text, Divider, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Security() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Stack>
      {!isMobile && <Text fontSize="3xl">Security</Text>}
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Account Security</Text>
        <Text color={"gray.400"}>(Setup 2FA Auth or Change Password)</Text>
      </Stack>
    </Stack>
  );
}
