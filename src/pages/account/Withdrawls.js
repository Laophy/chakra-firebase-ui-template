import { Text, Divider, Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Withdrawls() {
	// Grabbing a user from global storage via redux
	const user = useSelector((state) => state.data.user.user);

	return (
		<Stack>
			<Text fontSize="3xl">Withdrawls</Text>
			<Divider />
			<Stack alignItems={"center"} justifyContent={"center"} mt={10}>
				<Text fontSize="3xl">Withdrawl History</Text>
				<Text color={"gray.400"}>(Withdrawl History Will Appear Here)</Text>
			</Stack>
		</Stack>
	);
}
