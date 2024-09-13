import { Text, Divider, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function ExecutivePanel() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Stack>
      <Text fontSize="3xl">Executive Panel</Text>
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Executive Panel</Text>
        <Text color={"gray.400"}>(Do very very admin things here...)</Text>
      </Stack>
    </Stack>
  );
}
