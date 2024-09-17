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
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function CartInventory() {
  // Grabbing a user from global storage via redux
  const user = useSelector((state) => state.data.user.user);

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.600");

  return (
    <Stack>
      <Card bg={bg} m={2}>
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
