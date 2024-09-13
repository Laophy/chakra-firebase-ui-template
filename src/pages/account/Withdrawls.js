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
} from "@chakra-ui/react";
import moment from "moment";
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
      <TableContainer mt={10}>
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <span style={{ color: "gray" }}>{user?.uid}</span>
              </Td>
              <Td>{moment("Thu Aug 25 2024 17:30:03 GMT+0300").fromNow()}</Td>
              <Td>Deposit</Td>
              <Td>
                <span style={{ color: "green" }}>Complete</span>
              </Td>
              <Td isNumeric>$1,000.00</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
