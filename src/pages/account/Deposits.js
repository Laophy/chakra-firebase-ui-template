import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Text,
  Divider,
  Stack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  IconButton,
} from "@chakra-ui/react";
import moment from "moment/moment";
import { useSelector } from "react-redux";

export default function Deposits() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  return (
    <Stack>
      <Text fontSize="3xl">Deposits</Text>
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Deposits</Text>
        <Text color={"gray.400"}>(Deposit History Will Be Shown)</Text>
      </Stack>
      <TableContainer mt={10}>
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Created</Th>
              <Th>Updated</Th>
              <Th>Provider</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th isNumeric>Amount</Th>
              <Th>
                <IconButton
                  size={"md"}
                  icon={<SettingsIcon />}
                  aria-label={"Open Menu"}
                  variant={"ghost"}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <span style={{ color: "gray" }}>{user?.uid}</span>
              </Td>
              <Td>{moment("Thu Aug 25 2024 17:30:03 GMT+0300").fromNow()}</Td>
              <Td>{moment("Thu Aug 27 2024 17:30:03 GMT+0300").fromNow()}</Td>
              <Td>Checkout</Td>
              <Td>
                <span style={{ color: "green" }}>Deposit</span>
              </Td>
              <Td>
                <span style={{ color: "red" }}>Failed</span>
              </Td>
              <Td isNumeric>$150.00</Td>
              <Td>
                <IconButton
                  size={"md"}
                  icon={<SettingsIcon />}
                  aria-label={"Open Menu"}
                  variant={"outline"}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
