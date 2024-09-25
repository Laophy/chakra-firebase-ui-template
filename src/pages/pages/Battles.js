import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Image,
  VStack,
  Spinner,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
  useToast,
  HStack,
  SimpleGrid,
  Container,
  Stack,
} from "@chakra-ui/react";
import {
  motion,
  useMotionValue,
  animate,
  useTransform,
  useSpring,
} from "framer-motion";
import { formatMoney } from "../../utilities/Formatter";
import { setBalance } from "../../redux/userSlice";

const MotionBox = motion(Box);

const Card = ({ card, index, x, containerRef, totalCards }) => {
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const updateOpacity = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth / totalCards;
      const cardPosition = index * cardWidth;
      const centerPosition = containerWidth / 2 - cardWidth / 2;
      const relativePosition = cardPosition + x.get();
      const distance = Math.abs(relativePosition - centerPosition);

      if (distance < cardWidth / 2) {
        setOpacity(1);
      } else {
        setOpacity(0.3);
      }
    };

    updateOpacity();
    const unsubscribeX = x.onChange(updateOpacity);

    return () => {
      unsubscribeX();
    };
  }, [x, containerRef, index, totalCards]);

  return (
    <motion.div
      style={{ flex: `0 0 ${100 / totalCards}%`, display: "flex", opacity }}
    >
      <Image src={card.image} alt={card.name} width="100%" />
    </motion.div>
  );
};

const PokemonCarousel = () => {
  const user = useSelector((state) => state.data.user.user);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [cards, setCards] = useState([]);
  const [displayCards, setDisplayCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [wonCard, setWonCard] = useState(null);
  const [wonAmount, setWonAmount] = useState(null);
  const containerRef = useRef(null);

  const totalCardsInView = useBreakpointValue({ base: 3, sm: 4, md: 5, lg: 6 });
  const x = useMotionValue(0);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const calculateRotation = useCallback((x, y) => {
    if (!cardRef.current) return { rotateX: 0, rotateY: 0 };
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((x - centerX) / (rect.width / 2)) * 10;
    const rotateX = ((centerY - y) / (rect.height / 2)) * 10;
    return { rotateX, rotateY };
  }, []);

  const handleMouseMove = useCallback((event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  useEffect(() => {
    const { rotateX: newRotateX, rotateY: newRotateY } = calculateRotation(
      mousePosition.x,
      mousePosition.y
    );
    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  }, [mousePosition, calculateRotation, rotateX, rotateY]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchPokemonCards = useCallback(async () => {
    setIsFetching(true);
    let fetchedCards = [];
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?random=true&pageSize=80`
      );
      const data = await response.json();
      fetchedCards = data.data.map((card) => ({
        id: card.id,
        name: card.name,
        image: card.images.small,
        value: (() => {
          const tcgplayerPrices = card?.tcgplayer?.prices;
          const cardmarketPrices = card?.cardmarket?.prices;

          if (tcgplayerPrices) {
            const priceTypes = ["holofoil", "reverseHolofoil", "normal"];
            for (const type of priceTypes) {
              const price =
                tcgplayerPrices[type]?.market ||
                tcgplayerPrices[type]?.mid ||
                tcgplayerPrices[type]?.low;
              if (price && price > 0)
                return Math.max(1, Math.round(price * 100));
            }
          }

          if (cardmarketPrices) {
            const price =
              cardmarketPrices.averageSellPrice ||
              cardmarketPrices.trendPrice ||
              cardmarketPrices.avg1;
            if (price && price > 0) return Math.max(1, Math.round(price * 100));
          }

          return 1;
        })(),
      }));

      // Shuffle the fetched cards
      const shuffledCards = shuffleArray([...fetchedCards]);

      // Create a big list with multiple copies of shuffled cards
      const bigList = [];
      for (let i = 0; i < 5; i++) {
        bigList.push(...shuffleArray([...shuffledCards]));
      }

      // Shuffle the entire big list again for good measure
      const finalShuffledList = shuffleArray(bigList);

      setCards(finalShuffledList);
      setDisplayCards(finalShuffledList);
      setInitialPosition(finalShuffledList);
    } catch (error) {
      console.error("Error fetching Pokemon cards:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemonCards();
  }, [fetchPokemonCards]);

  const setInitialPosition = useCallback((cardList) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth / totalCardsInView;
      const randomIndex = Math.floor(Math.random() * cardList.length);
      const targetPosition = randomIndex * cardWidth;
      const centerPosition = containerWidth / 2 - cardWidth / 2;
      const initialX = -targetPosition + centerPosition;

      x.set(initialX);
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || displayCards.length === 0) return;
    setIsLoading(true);
    setIsSpinning(true);

    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth / totalCardsInView;
    const centerPosition = containerWidth / 2 - cardWidth / 2;
    const currentX = x.get();
    const currentIndex = Math.round((-currentX + centerPosition) / cardWidth);

    const minSpinCards = 40;
    const maxSpinCards = 55;
    const randomOffset =
      Math.floor(Math.random() * (maxSpinCards - minSpinCards)) + minSpinCards;
    let targetIndex = currentIndex + randomOffset;

    if (targetIndex >= displayCards.length) {
      targetIndex = targetIndex % displayCards.length;
    }

    const targetPosition = targetIndex * cardWidth;
    const calculatedTargetX = -targetPosition + centerPosition;

    x.stop();
    animate(x, calculatedTargetX, {
      duration: 5,
      ease: [0.1, 0.9, 0.2, 1],
      onComplete: () => {
        setIsLoading(false);
        setIsSpinning(false);

        const winningCard = displayCards[targetIndex % displayCards.length];
        setWonCard(winningCard);
        setWonAmount(winningCard.value);
        onOpen();
      },
    });
  }, [isSpinning, displayCards, x, onOpen]);

  const handleClaim = useCallback(() => {
    if (user) {
      dispatch(setBalance(user.balance + wonAmount));
      onClose();
      toast({
        title: "Success",
        description: `You won ${wonAmount} gems!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "You need to be logged in to claim.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, user, wonAmount, onClose, toast]);

  const calculateOdds = (cardId) => {
    const totalCards = displayCards.length;
    const cardCount = displayCards.filter((card) => card.id === cardId).length;
    return ((cardCount / totalCards) * 100).toFixed(2);
  };

  const aggregateCards = (cards) => {
    const cardMap = new Map();

    cards.forEach((card) => {
      if (cardMap.has(card.id)) {
        cardMap.get(card.id).odds += parseFloat(calculateOdds(card.id));
      } else {
        cardMap.set(card.id, {
          ...card,
          odds: parseFloat(calculateOdds(card.id)),
        });
      }
    });

    return Array.from(cardMap.values());
  };

  const aggregatedCards = aggregateCards(cards);

  return (
    <Container as={Stack} maxW="6xl" centerContent>
      <Box overflow="hidden">
        {isFetching ? (
          <Center height="200px">
            <Spinner size="xl" />
          </Center>
        ) : (
          <MotionBox
            ref={containerRef}
            display="flex"
            flexWrap="nowrap"
            width="100%"
            style={{ x }}
          >
            {displayCards.map((card, index) => (
              <Card
                key={`${card.id}-${index}`}
                card={card}
                index={index}
                x={x}
                containerRef={containerRef}
                totalCards={totalCardsInView}
              />
            ))}
          </MotionBox>
        )}
      </Box>
      <Button
        onClick={handleSpin}
        isLoading={isLoading}
        mb={4}
        isDisabled={isFetching}
        size={["md", "lg"]}
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
        Spin
      </Button>
      <Box
        mt={8}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        width="100%"
      >
        <Text fontSize="2xl" mb={4}>
          Possible Cards
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {aggregatedCards.map((card) => (
            <Box key={card.id} p={4} borderWidth="1px" borderRadius="lg">
              <HStack>
                <motion.div
                  style={{
                    position: "relative",
                    width: "auto",
                    height: "100%",
                    borderRadius: "5%", // Adjust this value to match your card's corner radius
                    overflow: "hidden",
                  }}
                  whileHover={{
                    boxShadow: "0 0 15px 5px rgba(255, 215, 0, 0.7)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <Image src={card.image} alt={card.name} w={130} h={160} />
                </motion.div>
                <VStack align="start">
                  <Text fontWeight="bold">{card.name}</Text>
                  <Text>Value: {formatMoney(card.value)}</Text>
                  <Text>Odds: {card.odds.toFixed(2)}%</Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You Won!</ModalHeader>
          <ModalCloseButton />
          <ModalBody onMouseMove={handleMouseMove}>
            {wonCard && (
              <VStack spacing={4}>
                <motion.div
                  ref={cardRef}
                  style={{
                    width: "100%",
                    height: "300px",
                    perspective: "1000px",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      rotateX: rotateX,
                      rotateY: rotateY,
                    }}
                  >
                    <motion.div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <motion.div
                        style={{
                          position: "relative",
                          width: "auto",
                          height: "100%",
                          borderRadius: "5%", // Adjust this value to match your card's corner radius
                          overflow: "hidden",
                        }}
                        whileHover={{
                          boxShadow: "0 0 15px 5px rgba(255, 215, 0, 0.7)",
                          transition: { duration: 0.3 },
                        }}
                      >
                        <Image
                          src={wonCard.image}
                          alt={wonCard.name}
                          style={{
                            height: "100%",
                            width: "auto",
                            objectFit: "contain",
                            borderRadius: "5%", // Match this with the wrapper's borderRadius
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
                <Text fontSize="xl" fontWeight="bold">
                  {wonCard.name}
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {formatMoney(wonAmount)}
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleClaim}
              size={["md", "lg"]}
              width="full"
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
              Sell Card
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              size={["md", "lg"]}
              width="full"
              rounded={"full"}
              bg={"green.400"}
              color={"white"}
              boxShadow={
                "0px 1px 25px -5px rgb(39 174 96 / 48%), 0 10px 10px -5px rgb(39 174 96 / 43%)"
              }
              _hover={{
                bg: "green.500",
              }}
              _focus={{
                bg: "green.500",
              }}
              l
            >
              Place in Inventory
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

const Battle = () => {
  return (
    <Box>
      <VStack>
        <PokemonCarousel />
      </VStack>
    </Box>
  );
};

export default Battle;
