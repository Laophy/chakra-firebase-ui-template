import { Text, Divider, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Claims() {
	// Grabbing a user from global storage via redux
	const user = useSelector((state) => state.data.user.user);

	return (
		<Stack>
			<Text fontSize="3xl">Claims</Text>
			<Divider />
			<Stack alignItems={"center"} justifyContent={"center"} mt={10}>
				<Text fontSize="3xl">Open Claims</Text>
				<Text color={"gray.400"}>(Active Claims Will Be Present)</Text>
			</Stack>
		</Stack>
	);
}
