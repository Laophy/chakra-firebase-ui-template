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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import moment from "moment";
import { ChatIcon } from "@chakra-ui/icons";
import { RiDeleteBinLine } from "react-icons/ri"; // Import the trash can icon
import { Filter } from "bad-words"; // Correct import for the bad-words library

const ChatBox = ({ user, isChatOpen, setIsChatOpen }) => {
  const toast = useToast();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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
      const setOnlineStatus = () => {
        setDoc(userDoc, {
          uid: user.uid,
          username: user.username || user.displayName || "User",
          lastActive: serverTimestamp(),
        });
      };

      setOnlineStatus();

      const intervalId = setInterval(setOnlineStatus, 60000); // Update every minute

      const unsubscribe = onSnapshot(onlineUsersRef, (snapshot) => {
        const now = new Date();
        const activeUsers = snapshot.docs.filter((doc) => {
          const lastActive = doc.data().lastActive?.toDate();
          return lastActive && now - lastActive < 120000; // Consider users active if last update was within 2 minutes
        });
        setOnlineUsers(activeUsers.length);
      });

      return () => {
        clearInterval(intervalId);
        unsubscribe();
      };
    }
  }, [user]);

  const filter = new Filter();

  const handleSendMessage = async () => {
    const { uid, photoURL, title } = user;
    const sanitizedMessage = messageText.trim().replace(/[<>&'"]/g, "");
    const cleanedMessage = filter.clean(sanitizedMessage);
    const safeMessage = cleanedMessage.substring(0, 500); // Limit message length

    if (safeMessage.trim()) {
      await addDoc(messagesRef, {
        title: title?.title ? title?.title : "",
        color: title?.color ? title?.color : "",
        content: safeMessage,
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

  const handleFocus = () => {
    document.body.classList.add("no-scroll");
  };

  const handleBlur = () => {
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAvatarClick = (uid) => {
    if (isMobile) {
      if (isChatOpen) {
        setIsChatOpen(false);
      }
      navigate(`/user/profile/${uid}`);
    }
  };

  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };

  return (
    <Container as={Stack} py={2} position="relative">
      <Box position="absolute" top={2} right={2}>
        <Tag
          colorScheme="blue"
          variant="outline"
          borderRadius="full"
          px={2}
          py={1}
          m={2}
        >
          <ChatIcon mr={1} />
          {onlineUsers}
        </Tag>
      </Box>
      <VStack>
        <Box
          ref={chatContainerRef}
          overflowY="auto"
          maxH={"85vh"}
          w={"100%"}
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
                <Box key={index} position="relative" m={1} bgColor={""}>
                  <Flex align="center">
                    {isMobile ? (
                      <Avatar
                        size="lg"
                        src={message.photoURL}
                        m={1}
                        onClick={() => handleAvatarClick(message.uid)}
                        cursor="pointer"
                      />
                    ) : (
                      <Link to={`/user/profile/${message.uid}`}>
                        <Avatar size="lg" src={message.photoURL} m={1} />
                      </Link>
                    )}
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
                        <Text
                          noOfLines={1}
                          fontSize="lg"
                          as={"b"}
                          position="relative"
                        >
                          {message?.username ? message?.username : "User"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {message?.timestamp}
                          {user?.isStaff && (
                            <IconButton
                              className="delete-icon"
                              icon={<RiDeleteBinLine />}
                              variant={"ghost"}
                              m={0.5}
                              aria-label="Delete Message"
                              transition="opacity 0.2s"
                              onClick={() =>
                                handleDeleteMessage(message.createdAt)
                              }
                            />
                          )}
                        </Text>
                      </HStack>
                      <Box
                        bg={bgReverse}
                        p={1.5}
                        borderRadius="xl"
                        maxWidth="100%"
                        overflowWrap="break-word"
                      >
                        <Text fontSize={"md"} wordBreak="break-word">
                          {message.content}
                        </Text>
                        <Text fontSize={"xs"} mt={3} color={timeStamp}>
                          {message?.createdAt
                            ? moment(message.createdAt.toDate()).fromNow()
                            : ""}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              ))}
          <div ref={messagesEndRef} />
        </Box>

        {user ? (
          <HStack width="full" justifyContent="space-between">
            <Input
              flex="1"
              placeholder="Type your message..."
              value={messageText}
              onChange={handleMessageChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={500}
            />
            <Button onClick={handleSendMessage}>Send</Button>
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
