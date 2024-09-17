import { SettingsIcon } from "@chakra-ui/icons";
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
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import moment from "moment";
import { useSelector } from "react-redux";

export default function Withdrawals() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const tempTransactions = [
    {
      id: "I2tUb9gblsNPo7MZrphtALZKXQf2",
      created: moment("Thu Aug 25 2024 17:30:03 GMT+0300").fromNow(),
      updated: moment("Thu Aug 27 2024 17:30:03 GMT+0300").fromNow(),
      provider: "Checkout",
      type: "Withdrawal",
      status: "Complete",
      amount: "$150.00",
    },
    {
      id: "I2tUb9gblsNPo7MZrphtALZKXQf2",
      created: moment("Thu Aug 25 2024 17:30:03 GMT+0300").fromNow(),
      updated: moment("Thu Aug 27 2024 17:30:03 GMT+0300").fromNow(),
      provider: "Checkout",
      type: "Withdrawal",
      status: "Complete",
      amount: "$150.00",
    },
    {
      id: "I2tUb9gblsNPo7MZrphtALZKXQf2",
      created: moment("Thu Aug 25 2024 17:30:03 GMT+0300").fromNow(),
      updated: moment("Thu Aug 27 2024 17:30:03 GMT+0300").fromNow(),
      provider: "Checkout",
      type: "Withdrawal",
      status: "Complete",
      amount: "$150.00",
    },
  ];

  return (
    <Stack>
      {!isMobile && <Text fontSize="3xl">Withdrawals</Text>}
      <Divider />
      <Stack alignItems={"center"} justifyContent={"center"} mt={10}>
        <Text fontSize="3xl">Withdrawal History</Text>
        <Text color={"gray.400"}>(Withdrawal History Will Appear Here)</Text>
      </Stack>
      {/* <TableContainer mt={10}>
        <Table size="sm" variant={"striped"}>
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
                  size={"sm"}
                  icon={<SettingsIcon />}
                  aria-label={"Open Menu"}
                  variant={"ghost"}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tempTransactions.map((transaction) => {
              return (
                <Tr>
                  <Td>
                    <span style={{ color: "gray" }}>{transaction.id}</span>
                  </Td>
                  <Td>{transaction.created}</Td>
                  <Td>{transaction.updated}</Td>
                  <Td>{transaction.provider}</Td>
                  <Td>
                    <span style={{ color: "green" }}>{transaction.type}</span>
                  </Td>
                  <Td>
                    <span style={{ color: "green" }}>{transaction.status}</span>
                  </Td>
                  <Td isNumeric>{transaction.amount}</Td>
                  <Td>
                    <IconButton
                      size={"sm"}
                      icon={<SettingsIcon />}
                      aria-label={"Open Menu"}
                      variant={"ghost"}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer> */}
    </Stack>
  );
}
