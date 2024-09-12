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

export default function Cart() {
	// Grabbing a user from global storage via redux
	const user = useSelector((state) => state.data.user.user);

	return (
		<Container as={Stack} maxW={"5xl"}>
			<Stack
				alignItems={"center"}
				justifyContent={"space-between"}
				flexWrap={"wrap"}
				flexDirection={"row"}
			>
				<Flex>
					<Heading as="h3" size="lg">
						Cart
					</Heading>
				</Flex>
				<Flex>
					<InputGroup>
						<InputLeftElement pointerEvents="none">
							<Search2Icon color="gray.300" />
						</InputLeftElement>
						<Input type="text" placeholder="Search" />
					</InputGroup>
					<Link to={"/cart"}>
						<Button variant={"solid"} colorScheme={"teal"} size={"md"} ml={4}>
							Sell Selected
						</Button>
					</Link>
				</Flex>
			</Stack>
			<Stack alignItems={"center"} justifyContent={"center"} mt={10}>
				<Text fontSize="4xl">Cart Items</Text>
				<Text color={"gray.400"}>(Your cart is empty)</Text>
			</Stack>
		</Container>
	);
}
