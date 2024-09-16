import { AttachmentIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Text,
  Stack,
  HStack,
  Input,
  Button,
  Avatar,
  VStack,
  CardBody,
  Card,
  GridItem,
  Grid,
  useColorMode,
  ButtonGroup,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function CartInventory() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack>
      <Card bg={colorMode === "light" ? "gray.200" : "gray.900"} m={2}>
        <CardBody>
          <VStack>
            <Text fontSize={"md"} as={"b"}>
              Your Cart is Empty
            </Text>
            <Text fontSize={"sm"} as={"i"}>
              Open packs or battle to earn XP and rewards!
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Stack>
  );
}
