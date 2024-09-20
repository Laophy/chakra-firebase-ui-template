import {
  Box,
  Avatar,
  Heading,
  Text,
  Button,
  Tag,
  Badge,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import moment from "moment";
import { formatMoney } from "../../utilities/Formatter";
import { useState } from "react";
import EditProfileModal from "../../components/modal/EditProfileModal";

export default function ProfileCard({
  profile,
  user,
  handleCopy,
  isMobile,
  attemptSaveChanges,
  attemptMute,
  attemptBan,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const bgColor = useColorModeValue("white", "gray.900");
  const badgeBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.400");
  const buttonBgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box
      maxW={isMobile ? "full" : "420px"}
      w={"full"}
      bg={bgColor}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={6}
      textAlign={"center"}
      position="relative"
    >
      {(user?.isStaff || user?.uid === profile?.uid) && (
        <Button
          position="absolute"
          top={4}
          right={4}
          size="sm"
          onClick={handleCopy}
          leftIcon={<CopyIcon />}
        >
          Copy ID
        </Button>
      )}
      {profile?.isStaff && (
        <Tag
          position="absolute"
          top={4}
          left={4}
          size="md"
          variant="solid"
          colorScheme={"red"}
        >
          {profile?.isHighStaff ? "High Staff" : "Staff"}
        </Tag>
      )}
      <Avatar
        size={"2xl"}
        src={profile?.photoURL}
        mb={4}
        pos={"relative"}
        _after={{
          content: '""',
          w: 4,
          h: 4,
          bg: "green.300",
          border: "2px solid white",
          rounded: "full",
          pos: "absolute",
          bottom: 0,
          right: 3,
        }}
      />
      <Heading fontSize={"2xl"} fontFamily={"body"}>
        {profile?.username}
      </Heading>
      <Text fontWeight={600} color={"gray.500"}>
        @{profile?.username}
      </Text>
      {profile?.title?.title && (
        <Tag
          size={"md"}
          key={"sm"}
          variant="solid"
          colorScheme={profile?.title?.color}
          mb={4}
        >
          {profile?.title?.title}
        </Tag>
      )}
      <Text textAlign={"center"} color={textColor} px={3}>
        {profile?.bio || "No bio set"}
      </Text>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        direction={"row"}
        mt={1}
      >
        <Badge
          colorScheme="blue"
          px={2}
          py={1}
          bg={badgeBgColor}
          fontWeight={"400"}
        >
          <Text fontSize={"md"} color={"blue.400"}>
            {formatMoney(profile?.balance)}
          </Text>
        </Badge>
      </Stack>
      <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
        <Badge
          colorScheme="blue"
          px={2}
          py={1}
          bg={badgeBgColor}
          fontWeight={"400"}
        >
          Account Created
        </Badge>
        <Badge
          colorScheme="green"
          px={2}
          py={1}
          bg={badgeBgColor}
          fontWeight={"400"}
        >
          {moment(new Date(profile?.createdAt)).fromNow()}
        </Badge>
      </Stack>
      <Stack mt={8} direction={"row"} spacing={4}>
        <Button
          flex={1}
          fontSize={"sm"}
          rounded={"full"}
          _hover={{
            bg: buttonBgColor,
          }}
        >
          Message
        </Button>
        <Button
          flex={1}
          fontSize={"sm"}
          rounded={"full"}
          bg={"blue.400"}
          color={"white"}
          boxShadow={
            "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
          }
          _hover={{
            bg: "blue.500",
          }}
          _focus={{
            bg: "blue.500",
          }}
        >
          Tip Gems
        </Button>
      </Stack>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpen={openModal}
        profile={profile}
        user={user}
        isMobile={isMobile}
        attemptSaveChanges={attemptSaveChanges}
        attemptMute={attemptMute}
        attemptBan={attemptBan}
      />
    </Box>
  );
}
