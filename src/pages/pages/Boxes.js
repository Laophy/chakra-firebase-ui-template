import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Button,
  VStack,
  Text,
  Image,
  Center,
  useBreakpointValue,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
} from "@chakra-ui/react";
import ReactConfetti from "react-confetti";
import { formatMoney } from "../../utilities/Formatter";
import flipcard from "../../assets/sounds/flipcard.mp3";
import claimgems from "../../assets/sounds/claimgems.mp3";
import { volume } from "../../utilities/constants";

export default function Boxes() {
  const [prizeList, setPrizeList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef(null);
  const spinIntervalRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const spinButtonRef = useRef(null);
  const [winningPrize, setWinningPrize] = useState(null);
  const [isSpinEnding, setIsSpinEnding] = useState(false);
  const [closestPrize, setClosestPrize] = useState(null);
  const [lastPlayedPrize, setLastPlayedPrize] = useState(null);

  const wheelSize = useBreakpointValue({
    base: "300px",
    md: "400px",
    lg: "500px",
  });
  const prizeSize = useBreakpointValue({
    base: "75px",
    md: "90px",
    lg: "120px",
  });
  const containerPadding = useBreakpointValue({ base: 2, md: 5 });

  useEffect(() => {
    fetchRandomPrizes();
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const fetchRandomPrizes = async () => {
    try {
      const baseSets = [
        "https://pokeapi.co/api/v2/pokemon?limit=151", // Base set
        "https://pokeapi.co/api/v2/pokemon?offset=151&limit=100", // Fossil
        "https://pokeapi.co/api/v2/pokemon?offset=251&limit=100", // Base set 2
        "https://pokeapi.co/api/v2/pokemon?offset=251&limit=100", // Neo
      ];
      const randomSetUrl =
        baseSets[Math.floor(Math.random() * baseSets.length)];
      const response = await fetch(randomSetUrl);
      const data = await response.json();
      const shuffled = data.results.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      const prizeDetails = await Promise.all(
        selected.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          const detailData = await detailResponse.json();
          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.front_default,
            value: Math.floor(Math.random() * 1000) + 100, // Store as string
          };
        })
      );

      setPrizeList(prizeDetails);
      return prizeDetails;
    } catch (error) {
      console.error("Error fetching prizes:", error);
      return [];
    }
  };

  const startCountdown = async () => {
    setCountdown(3);
    const newPrizeList = await fetchRandomPrizes();

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current);
          spinWheel(newPrizeList);
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const spinWheel = (currentPrizeList) => {
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    setWinningPrize(null);
    setIsSpinEnding(false);

    const segmentSize = 360 / currentPrizeList.length;

    const minSpins = 3;
    const maxSpins = 4;
    const extraSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = extraSpins * 360 + Math.random() * 360;

    const duration = 4500;
    const fps = 120;
    const frames = duration / (1000 / fps);
    let currentFrame = 0;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);

      const currentRotation = totalRotation * easedProgress;
      setRotation(currentRotation);

      const normalizedRotation = ((currentRotation % 360) + 360) % 360;
      const closestIndex =
        Math.floor(normalizedRotation / segmentSize) % currentPrizeList.length;
      const closestPrize = currentPrizeList[closestIndex];
      setClosestPrize(closestPrize);

      if (progress > 0.7 && !isSpinEnding) {
        setIsSpinEnding(true);
      }

      if (currentFrame >= frames) {
        clearInterval(spinIntervalRef.current);
        setSpinning(false);
        setResult(closestPrize);
        setWinningPrize(closestPrize);
        setShowConfetti(true);

        // Winner sounds
        const newAudio = new Audio(claimgems);
        newAudio.volume = volume;
        newAudio.play();

        setRotation(totalRotation);

        setTimeout(() => setShowConfetti(false), 1000);
      }
    }, 1000 / fps);

    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
    }, duration);
  };

  const getOpacityAndScale = (prize) => {
    if (spinning) {
      if (prize === closestPrize) {
        return { opacity: 1, scale: 1.35 };
      } else {
        const segmentSize = 360 / prizeList.length;
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        const prizeAngle = prizeList.indexOf(prize) * segmentSize;
        const distance = Math.abs(normalizedRotation - prizeAngle);
        const fadeDistance = Math.min(distance, 360 - distance);
        const opacity = Math.max(0.3, 1 - fadeDistance / (segmentSize * 1.5));
        return { opacity, scale: 1 + (opacity - 0.1) * 0.5 };
      }
    } else if (winningPrize) {
      if (prize === winningPrize) {
        return { opacity: 1, scale: 1.35 };
      } else {
        return { opacity: 0.1, scale: 1 };
      }
    } else {
      return { opacity: 1, scale: 1 };
    }
  };

  const getPosition = (angle, radius) => {
    const radian = angle * (Math.PI / 180);
    const x = Math.sin(radian) * radius;
    const y = -Math.cos(radian) * radius;
    return { x, y };
  };
  const [lastSoundPlayedTime, setLastSoundPlayedTime] = useState(0);
  const soundBufferTime = 50; // Minimum time between sounds in milliseconds

  useEffect(() => {
    if (closestPrize && spinning && closestPrize !== lastPlayedPrize) {
      const currentTime = Date.now();
      if (currentTime - lastSoundPlayedTime > soundBufferTime) {
        const newAudio = new Audio(flipcard);
        newAudio.volume = volume;
        newAudio.play();
        console.log("Card sound played");
        setLastPlayedPrize(closestPrize);
        setLastSoundPlayedTime(currentTime);
      }
    }
  }, [closestPrize, spinning, lastPlayedPrize, lastSoundPlayedTime]);

  return (
    <Container as={Stack} maxW="7xl" centerContent p={containerPadding}>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          confettiSource={{
            x: spinButtonRef.current?.getBoundingClientRect().left || 0,
            y: spinButtonRef.current?.getBoundingClientRect().top || 0,
            w: spinButtonRef.current?.offsetWidth || 0,
            h: spinButtonRef.current?.offsetHeight || 0,
          }}
          tweenDuration={1000}
        />
      )}

      <Card
        borderRadius="lg"
        overflow="hidden"
        w={"100%"}
        boxShadow="0 0 40px rgba(66, 153, 225, 0.3)"
        borderColor="gray.600"
      >
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center" mb={4}>
              Daily Reward
            </Heading>
            <Box
              w={wheelSize}
              h={wheelSize}
              borderRadius="full"
              borderWidth="4px"
              borderColor="transparent"
              position="relative"
            >
              {prizeList.map((prize, index) => {
                const angle = index * (360 / prizeList.length);
                const radius =
                  parseInt(wheelSize) / 2 - parseInt(prizeSize) / 2;
                const position = getPosition(angle, radius);
                const { opacity, scale } = getOpacityAndScale(prize);
                return (
                  <Image
                    key={prize.id}
                    src={prize.image}
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${scale})`}
                    width={prizeSize}
                    height={prizeSize}
                    alt={prize.name}
                    opacity={opacity}
                    transition="opacity 0.1s, transform 0.1s, scale 0.1s"
                  />
                );
              })}
              {countdown !== null && (
                <Center
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="rgba(0, 0, 0, 0.5)"
                  color="white"
                  fontSize={["4xl", "6xl"]}
                  fontWeight="bold"
                  borderRadius="full"
                >
                  {countdown}
                </Center>
              )}
            </Box>
          </VStack>
        </CardBody>
        <CardFooter>
          <VStack spacing={4} width="100%">
            <Text fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center">
              {countdown !== null ? (
                "Get ready..."
              ) : spinning ? (
                "Spinning..."
              ) : result ? (
                <>
                  You won: {result.name} {formatMoney(result.value)}
                </>
              ) : (
                "Spin the wheel!"
              )}
            </Text>
            <Button
              ref={spinButtonRef}
              colorScheme="blue"
              onClick={startCountdown}
              isDisabled={spinning || countdown !== null}
              isLoading={spinning}
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
              {spinning
                ? ""
                : countdown !== null
                ? `Starting in ${countdown}...`
                : "Spin the Wheel"}
            </Button>
          </VStack>
        </CardFooter>
      </Card>
    </Container>
  );
}
