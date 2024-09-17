import { Text, Divider, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Sales() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Stack>
      {!isMobile && <Text fontSize="3xl">Sales</Text>}
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Sales Receipts</Text>
        <Text color={"gray.400"}>(Sales Receipts Will Appear Here)</Text>
      </Stack>
    </Stack>
  );
}
