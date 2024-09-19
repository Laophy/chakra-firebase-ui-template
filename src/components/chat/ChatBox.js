import {
  Box,
  VStack,
  Flex,
  Avatar,
  HStack,
  Text,
  Input,
  Button,
  Tag,
  useColorModeValue,
  Container,
  Stack,
  IconButton,
  Tooltip,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { RiDeleteBack2Line, RiVolumeMuteLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  limit,
  deleteDoc,
  doc,
  getDocs,
  where,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { Link } from "react-router-dom";
import { FaBan } from "react-icons/fa";
import moment from "moment";
import { CheckCircleIcon } from "@chakra-ui/icons";

const ChatBox = ({ user }) => {
  const toast = useToast();
  const [onlineUsers, setOnlineUsers] = useState(0);

  const messagesRef = collection(firestore, "messages");
  const onlineUsersRef = collection(firestore, "onlineUsers");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(35));
  const [messages] = useCollectionData(q, { idField: "id" });

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const bg = useColorModeValue("gray.100", "gray.700");
  const bgReverse = useColorModeValue("gray.300", "gray.500");
  const timeStamp = useColorModeValue("gray.500", "gray.400");

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageText]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      const userDoc = doc(onlineUsersRef, user.uid);
      setDoc(userDoc, {
        uid: user.uid,
        username: user.username || user.displayName || "User",
      });

      const unsubscribe = onSnapshot(onlineUsersRef, (snapshot) => {
        setOnlineUsers(snapshot.size);
      });

      const handleBeforeUnload = async () => {
        await deleteDoc(userDoc);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        deleteDoc(userDoc);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        unsubscribe();
      };
    }
  }, [user]);

  const handleSendMessage = async () => {
    const { uid, photoURL, title } = user;
    if (messageText.trim()) {
      await addDoc(messagesRef, {
        title: title?.title ? title?.title : "",
        color: title?.color ? title?.color : "",
        content: messageText,
        username: user?.username
          ? user?.username
          : user?.displayName
          ? user?.displayName
          : "User",
        createdAt: serverTimestamp(),
        uid,
        photoURL: photoURL ? photoURL : "",
      });
      setMessageText("");
    }
  };

  const handleDeleteMessage = async (createdAt) => {
    try {
      const messageQuery = query(
        messagesRef,
        where("createdAt", "==", createdAt)
      );
      const messageSnapshot = await getDocs(messageQuery);
      if (!messageSnapshot.empty) {
        const messageDoc = messageSnapshot.docs[0];
        await deleteDoc(doc(firestore, "messages", messageDoc.id));
        toast({
          title: "Delete Message",
          description: "Message deleted successfully.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Message not found");
      }
    } catch (error) {
      toast({
        title: "Delete Message Failed",
        description: `Failed to delete message: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMuteUser = () => {
    toast({
      title: "Mute User",
      description: "This would mute the user.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleBanUser = () => {
    toast({
      title: "Ban User",
      description: "This would ban the user.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container
      as={Stack}
      minHeight={"75vh"}
      maxW={"sm"}
      py={2}
      position="relative"
    >
      <Box position="absolute" top={2} right={2} zIndex={1}>
        <Badge
          colorScheme="green"
          variant="solid"
          borderRadius="full"
          px={2}
          py={1}
        >
          Online Users: {onlineUsers}
        </Badge>
      </Box>
      <VStack h={"75vh"}>
        <Box
          ref={chatContainerRef}
          overflowY="auto"
          w={"sm"}
          maxH={"70vh"}
          bg={bg}
          borderRadius="md"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {messages &&
            messages
              .slice(0)
              .reverse()
              .map((message, index) => (
                <Box
                  key={index}
                  position="relative"
                  _hover={{ ".icon-buttons": { opacity: 1 } }}
                >
                  <Flex align="center" m={3}>
                    <Link to={`/user/profile/${message.uid}`}>
                      <Avatar size="lg" src={message.photoURL} m={1} />
                    </Link>
                    <Box>
                      <HStack>
                        {message?.title && (
                          <Tag
                            size={"md"}
                            key={"sm"}
                            variant="solid"
                            colorScheme={message?.color}
                          >
                            {message?.title}
                          </Tag>
                        )}
                        <Text noOfLines={1} fontSize="lg" as={"b"}>
                          {message?.username ? message?.username : "User"}
                        </Text>
                      </HStack>
                      <Box bg={bgReverse} p={1.5} borderRadius="xl">
                        <Text fontSize={"md"}>{message.content}</Text>
                        <Text fontSize={"xs"} mt={3} color={timeStamp}>
                          {message?.createdAt
                            ? moment(message.createdAt.toDate()).fromNow()
                            : ""}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                  {user?.isStaff && (
                    <HStack
                      className="icon-buttons"
                      spacing={2}
                      position="absolute"
                      right={1}
                      top={0}
                      opacity={0}
                      transition="opacity 0.2s"
                    >
                      <Tooltip
                        label="Delete Message"
                        aria-label="Delete Message Tooltip"
                      >
                        <IconButton
                          icon={<RiDeleteBack2Line />}
                          variant={"outline"}
                          colorScheme="red"
                          aria-label="Delete Message"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.createdAt)}
                        />
                      </Tooltip>
                      <Tooltip label="Mute User" aria-label="Mute User Tooltip">
                        <IconButton
                          icon={<RiVolumeMuteLine />}
                          aria-label="Mute User"
                          variant={"outline"}
                          colorScheme="purple"
                          size="sm"
                          onClick={handleMuteUser}
                        />
                      </Tooltip>
                      <Tooltip label="Ban User" aria-label="Ban User Tooltip">
                        <IconButton
                          icon={<FaBan />}
                          aria-label="Ban User"
                          variant={"outline"}
                          colorScheme="yellow"
                          size="sm"
                          onClick={handleBanUser}
                        />
                      </Tooltip>
                    </HStack>
                  )}
                </Box>
              ))}
          <div ref={messagesEndRef} />
        </Box>
        {user ? (
          <HStack w={"sm"}>
            <Input
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button onClick={handleSendMessage} ml={2}>
              Send
            </Button>
          </HStack>
        ) : (
          <Box
            w="100%"
            display="flex"
            p={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text>Sign in to Chat</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ChatBox;
