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
  Divider, // Add this line
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";

const ChatBox = ({ user }) => {
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(35));
  const [messages] = useCollectionData(q, { idField: "id" });

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const bg = useColorModeValue("gray.100", "gray.700");
  const bgReverse = useColorModeValue("gray.300", "gray.500");

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

  const handleSendMessage = async () => {
    const { uid, photoURL } = user;
    if (messageText.trim()) {
      await addDoc(messagesRef, {
        title: user?.title?.title,
        color: user?.title?.color,
        content: messageText,
        username: user?.username,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });
      setMessageText("");
    }
  };

  return (
    <Container as={Stack} minHeight={"75vh"} maxW={"sm"} py={2}>
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
                <Flex key={index} align="center" m={3}>
                  <Avatar size="lg" src={message.photoURL} m={1} />
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
                    </Box>
                  </Box>
                </Flex>
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
