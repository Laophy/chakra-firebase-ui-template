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
  SimpleGrid,
  Container,
  Stack,
  CardBody,
  Card,
} from "@chakra-ui/react";
import { motion, useMotionValue, animate, useSpring } from "framer-motion";
import { formatMoney } from "../../utilities/Formatter";
import { setBalance } from "../../redux/userSlice";
import flipcard from "../../assets/sounds/flipcard_compressed.mp3";
import success from "../../assets/sounds/success.mp3";
import claimgems from "../../assets/sounds/claimgems.mp3";
import { volume } from "../../utilities/constants";

const MotionBox = motion(Box);

const PokemonCard = ({
  card,
  index,
  x,
  containerRef,
  totalCards,
  isSpinning,
  lastSoundPlayedTime,
  setLastSoundPlayedTime,
  soundBufferTime,
}) => {
  const [opacity, setOpacity] = useState(0.3);
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const audioRef = useRef(null);

  useEffect(() => {
    if (opacity === 1 && isSpinning && !isMobile) {
      const currentTime = Date.now();
      if (currentTime - lastSoundPlayedTime > soundBufferTime) {
        if (!audioRef.current) {
          audioRef.current = new Audio(flipcard);
        }
        console.log("playing audio");
        audioRef.current.currentTime = 0; // Reset audio to start
        audioRef.current.volume = volume; // Set volume to 50%
        audioRef.current
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
        setLastSoundPlayedTime(currentTime);
      }
    }
  }, [opacity, isSpinning, lastSoundPlayedTime, soundBufferTime, isMobile]);

  return (
    <motion.div
      style={{
        flex: `0 0 ${100 / totalCards}%`,
        display: "flex",
        opacity,
        transform: opacity === 1 ? "scale(1.07)" : "scale(1)",
        transition: "transform 0.5s",
      }}
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
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const [lastSoundPlayedTime, setLastSoundPlayedTime] = useState(0);
  const soundBufferTime = 120; // Minimum time between sounds in milliseconds

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
      // Fetch all sets
      const setsResponse = await fetch("https://api.pokemontcg.io/v2/sets");
      const setsData = await setsResponse.json();
      const allSets = setsData.data;

      // Randomly select 5 sets
      const randomSets = shuffleArray([...allSets]).slice(0, 2);

      // Fetch 20 random cards from each of the 5 random sets
      const cardPromises = randomSets.map((set) =>
        fetch(
          `https://api.pokemontcg.io/v2/cards?q=set.id:${set.id}&pageSize=20&random=true`
        ).then((res) => res.json())
      );

      const cardResponses = await Promise.all(cardPromises);
      const randomCards = cardResponses.flatMap((response) => response.data);
      fetchedCards = randomCards.map((card) => ({
        id: card.id,
        name: card.name,
        image: (() => {
          const images = [
            card.images.small,
            card.images.large,
            card.images.normal,
            card.imageUrl,
            card.imageUrlHiRes,
          ];
          const frontImage = images.find((img) => img && !img.includes("back"));
          return frontImage || "";
        })(),
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
              if (price && price > 0) return price;
            }
          }

          if (cardmarketPrices) {
            const price =
              cardmarketPrices.averageSellPrice ||
              cardmarketPrices.trendPrice ||
              cardmarketPrices.avg1;
            if (price && price > 0) return price;
          }

          return 1;
        })(),
      }));

      // Sort cards by value in descending order
      fetchedCards.sort((a, b) => b.value - a.value);

      // Select top 10 most expensive cards
      const expensiveCards = fetchedCards.slice(0, 5);

      // Calculate the total value of all cards
      const totalValue = fetchedCards.reduce(
        (sum, card) => sum + card.value,
        0
      );

      // Calculate odds for each card based on its value
      fetchedCards = fetchedCards.map((card) => ({
        ...card,
        odds: card.value / totalValue,
      }));

      // Create a weighted list with more copies of cheaper cards
      const weightedList = fetchedCards.flatMap((card) => {
        const copies = Math.max(1, Math.floor(card.odds * 100));
        return Array(copies).fill(card);
      });

      // Ensure at least one copy of each expensive card is included
      expensiveCards.forEach((card) => {
        if (!weightedList.some((c) => c.id === card.id)) {
          weightedList.push(card);
        }
      });

      // Shuffle the weighted list
      const finalShuffledList = shuffleArray(weightedList);

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

      x.set(0);
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || displayCards.length === 0) return;
    setIsLoading(true);
    setIsSpinning(true);

    setInitialPosition(displayCards);

    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = containerWidth / totalCardsInView;
    const centerPosition = containerWidth / 2 - cardWidth / 2;

    // Calculate cumulative odds
    const totalOdds = displayCards.reduce((sum, card) => sum + card.odds, 0);
    let cumulativeOdds = 0;
    const cumulativeOddsArray = displayCards.map((card) => {
      cumulativeOdds += card.odds;
      return cumulativeOdds;
    });

    // Generate a random number and select the winning card based on odds
    const randomValue = Math.random() * totalOdds;
    const winningIndex = cumulativeOddsArray.findIndex(
      (cumulativeOdd) => randomValue <= cumulativeOdd
    );

    const winningCard = displayCards[winningIndex];
    setWonCard(winningCard);
    setWonAmount(winningCard.value);

    // Calculate the target position to land on the winning card
    const targetPosition = winningIndex * cardWidth;
    const calculatedTargetX = -targetPosition + centerPosition;

    x.stop();
    animate(x, calculatedTargetX, {
      duration: 5,
      ease: [0.1, 0.9, 0.2, 1],
      onComplete: () => {
        setIsLoading(false);
        setIsSpinning(false);
        onOpen();
        if (!isMobile) {
          const successAudio = new Audio(success);
          successAudio.volume = volume;
          successAudio.play();
        }
      },
    });
  }, [isSpinning, displayCards, x, onOpen, isMobile]);

  const handleClaim = useCallback(() => {
    if (user) {
      dispatch(setBalance(user.balance + wonAmount));
      onClose();
      if (!isMobile) {
        const successAudio = new Audio(claimgems);
        successAudio.volume = volume;
        successAudio.play();
      }
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
  }, [dispatch, user, wonAmount, onClose, toast, isMobile]);

  const calculateOdds = (cards) => {
    const totalValue = cards.reduce((sum, card) => sum + card.value, 0);
    const maxValue = Math.max(...cards.map((card) => card.value));
    const minValue = Math.min(...cards.map((card) => card.value));
    const range = maxValue - minValue;

    return cards.map((card) => ({
      ...card,
      odds: ((maxValue - card.value + minValue) / totalValue) * 100,
    }));
  };

  const aggregateCards = (cards) => {
    const cardMap = new Map();

    cards.forEach((card) => {
      if (cardMap.has(card.id)) {
        cardMap.get(card.id).count += 1;
      } else {
        cardMap.set(card.id, { ...card, count: 1 });
      }
    });

    const aggregatedCards = Array.from(cardMap.values());
    return calculateOdds(aggregatedCards);
  };

  const aggregatedCards = aggregateCards(cards);

  return (
    <Container as={Stack} maxW="7xl" centerContent>
      <Card
        mt={4}
        p={4}
        borderWidth="2px"
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        boxShadow="0 0 40px rgba(66, 153, 225, 0.3)"
        borderColor="gray.600"
      >
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
              <PokemonCard
                key={`${card.id}-${index}`}
                card={card}
                index={index}
                x={x}
                containerRef={containerRef}
                totalCards={totalCardsInView}
                isSpinning={isSpinning}
                lastSoundPlayedTime={lastSoundPlayedTime}
                setLastSoundPlayedTime={setLastSoundPlayedTime}
                soundBufferTime={soundBufferTime}
              />
            ))}
          </MotionBox>
        )}
      </Card>
      <Button
        onClick={handleSpin}
        isLoading={isLoading}
        mb={4}
        mt={4}
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
      <Card
        mt={8}
        p={4}
        borderWidth="2px"
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        boxShadow="0 0 40px rgba(66, 153, 225, 0.3)"
        borderColor="gray.600"
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 5, xl: 6 }}
          spacing={2}
        >
          {aggregatedCards
            .filter((card) => card.value !== undefined)
            .sort((a, b) => b.value - a.value)

            .map((card) => (
              <Card key={card.id} p={3} borderRadius="lg" bgColor="gray.800">
                <CardBody>
                  <Text
                    position="absolute"
                    top={1}
                    left={1}
                    bg="rgba(0,0,0,0.7)"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {formatMoney(card?.value)}
                  </Text>
                  <Text
                    position="absolute"
                    top={1}
                    right={1}
                    bg="rgba(0,0,0,0.7)"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {card?.odds?.toFixed(2)}%
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Box position="relative">
                      <motion.div
                        style={{
                          position: "relative",
                          width: "100%",
                          paddingBottom: "130%", // Aspect ratio for Pokemon cards (2.5" x 3.5")
                          borderRadius: "5%",
                        }}
                      >
                        <motion.div
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            perspective: "1000px",
                          }}
                        >
                          <motion.img
                            src={card.image}
                            alt={card.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "5%",
                              opacity: 0.75,
                            }}
                            whileHover={{
                              scale: 1.05,
                              opacity: 1,
                              transition: { duration: 0.1 },
                            }}
                            initial={{ scale: 1 }}
                          />
                        </motion.div>
                      </motion.div>
                    </Box>
                    <Text fontWeight="bold" fontSize="md" noOfLines={1}>
                      {card.name}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
        </SimpleGrid>
      </Card>
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
