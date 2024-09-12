import { Text, Divider, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function History() {
	// Grabbing a user from global storage via redux
	const user = useSelector((state) => state.data.user.user);

	return (
		<Stack>
			<Text fontSize="3xl">History</Text>
			<Divider />
			<Stack alignItems={"center"} justifyContent={"center"} mt={10}>
				<Text fontSize="3xl">Game History</Text>
				<Text color={"gray.400"}>(View Previous Game History)</Text>
			</Stack>
		</Stack>
	);
}
