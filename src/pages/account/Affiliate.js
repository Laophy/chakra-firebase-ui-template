import { EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Text,
  Divider,
  Stack,
  CardBody,
  VStack,
  Avatar,
  Card,
  GridItem,
  useColorMode,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Th,
  Tr,
  Tfoot,
  Td,
  Tbody,
  Thead,
  Table,
  TableContainer,
  HStack,
  Button,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Affiliate() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack>
      <Text fontSize="3xl">Affiliate</Text>
      <Divider />
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Affiliate Code</StatLabel>
                <StatNumber>
                  <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Text>
                      {user?.affiliate?.code ? user?.affiliate?.code : "n/a"}
                    </Text>
                    <IconButton
                      aria-label="Set Affiliate"
                      icon={<EditIcon />}
                      size={"sm"}
                    />
                  </HStack>
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Users</StatLabel>
                <StatNumber>
                  {user?.affiliate?.users ? user?.affiliate?.users : 0}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Total Deposited</StatLabel>
                <StatNumber>
                  $
                  {user?.affiliate?.totalDeposited
                    ? user?.affiliate?.totalDeposited?.toFixed(2)
                    : 0?.toFixed(2)}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Total Opened</StatLabel>
                <StatNumber>
                  $
                  {user?.affiliate?.totalOpened
                    ? user?.affiliate?.totalOpened?.toFixed(2)
                    : 0?.toFixed(2)}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Total Earnings</StatLabel>
                <StatNumber>
                  $
                  {user?.affiliate?.totalEarnings
                    ? user?.affiliate?.totalEarnings?.toFixed(2)
                    : 0?.toFixed(2)}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem w="100%">
          <Card bg={colorMode === "light" ? "gray.200" : "gray.900"}>
            <CardBody>
              <Stat>
                <StatLabel>Unclaimed Earnings</StatLabel>
                <StatNumber>
                  $
                  {user?.affiliate?.unclaimedEarnings
                    ? user?.affiliate?.unclaimedEarnings?.toFixed(2)
                    : 0?.toFixed(2)}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize="sm" as={"b"}>
          Showing 1 - 0 of 0
        </Text>
        <HStack>
          <Button variant="solid" colorScheme="gray" size={"sm"}>
            Previous
          </Button>
          <Button variant="solid" colorScheme="gray" ml={1} size={"sm"}>
            Next
          </Button>
        </HStack>
      </HStack>
      {/* <TableContainer>
        <Table size="sm" colorScheme={"black"}>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th isNumeric>Deposited</Th>
              <Th isNumeric>Opened</Th>
              <Th isNumeric>Commission</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{user?.username}</Td>
              <Td isNumeric>$0.00</Td>
              <Td isNumeric>$0.00</Td>
              <Td isNumeric>
                <span style={{ color: "green" }}>$0.00</span>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer> */}
    </Stack>
  );
}
