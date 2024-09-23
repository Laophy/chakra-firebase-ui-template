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
  Line,
} from "@chakra-ui/react";
import ReactConfetti from "react-confetti";

export default function Boxes() {
  const [pokemonList, setPokemonList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef(null);
  const spinIntervalRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const spinButtonRef = useRef(null);
  const [winningPokemon, setWinningPokemon] = useState(null);
  const [isSpinEnding, setIsSpinEnding] = useState(false);
  const [closestPokemon, setClosestPokemon] = useState(null);

  const wheelSize = useBreakpointValue({ base: "300px", md: "400px" });
  const pokemonSize = useBreakpointValue({ base: "60px", md: "90px" });
  const containerPadding = useBreakpointValue({ base: 4, md: 10 });

  useEffect(() => {
    fetchRandomPokemon();
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const fetchRandomPokemon = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      const shuffled = data.results.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      const pokemonDetails = await Promise.all(
        selected.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          const detailData = await detailResponse.json();
          return {
            name: detailData.name,
            image: detailData.sprites.front_default,
          };
        })
      );

      setPokemonList(pokemonDetails);
      return pokemonDetails; // Return the new list
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      return []; // Return an empty array in case of error
    }
  };

  const startCountdown = async () => {
    setCountdown(3);
    const newPokemonList = await fetchRandomPokemon(); // Randomize Pokemon when countdown starts

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current);
          spinWheel(newPokemonList); // Pass the new Pokemon list to spinWheel
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const spinWheel = (currentPokemonList) => {
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    setWinningPokemon(null);
    setIsSpinEnding(false);

    const segmentSize = 360 / currentPokemonList.length;

    // Calculate total rotation (multiple spins + random ending)
    const minSpins = 5;
    const maxSpins = 10;
    const extraSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = extraSpins * 360 + Math.random() * 360;

    const duration = 5000; // 5 seconds
    const fps = 60;
    const frames = duration / (1000 / fps);
    let currentFrame = 0;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;

      // Use a custom easing function for smoother deceleration
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);

      const currentRotation = totalRotation * easedProgress;
      setRotation(currentRotation);

      // Update closest Pokémon
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;
      const closestIndex =
        Math.floor(normalizedRotation / segmentSize) %
        currentPokemonList.length;
      const closestPokemon = currentPokemonList[closestIndex];
      setClosestPokemon(closestPokemon);

      // Set isSpinEnding to true when we're in the last 30% of the animation
      if (progress > 0.7 && !isSpinEnding) {
        setIsSpinEnding(true);
      }

      if (currentFrame >= frames) {
        clearInterval(spinIntervalRef.current);
        setSpinning(false);
        setResult(closestPokemon);
        setWinningPokemon(closestPokemon);
        setShowConfetti(true);

        // Ensure the final rotation aligns with the winning Pokémon
        setRotation(totalRotation);

        // Debug log
        console.log("Final rotation:", totalRotation);
        console.log("Winning index:", closestIndex);
        console.log("Winning Pokémon:", closestPokemon.name);

        // Hide confetti after 1 second
        setTimeout(() => setShowConfetti(false), 1000);
      }
    }, 1000 / fps);

    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
    }, duration);
  };

  const getOpacityAndScale = (pokemon) => {
    if (spinning) {
      if (pokemon === closestPokemon) {
        return { opacity: 1, scale: 1.2 };
      } else {
        const segmentSize = 360 / pokemonList.length;
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        const pokemonAngle = pokemonList.indexOf(pokemon) * segmentSize;
        const distance = Math.abs(normalizedRotation - pokemonAngle);
        const fadeDistance = Math.min(distance, 360 - distance);
        const opacity = Math.max(0.3, 1 - fadeDistance / (segmentSize * 1.5));
        return { opacity, scale: 1 + (opacity - 0.3) * 0.4 };
      }
    } else if (winningPokemon) {
      if (pokemon === winningPokemon) {
        return { opacity: 1, scale: 1.2 };
      } else {
        return { opacity: 0.3, scale: 1 };
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

  // Add this new function to calculate the line coordinates
  const getLineCoordinates = () => {
    if (!closestPokemon) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    const index = pokemonList.findIndex((p) => p.name === closestPokemon.name);
    const angle = index * (360 / pokemonList.length);
    const radius = parseInt(wheelSize) / 2;
    const position = getPosition(angle, radius);
    return {
      x1: radius,
      y1: radius,
      x2: radius + position.x,
      y2: radius + position.y,
    };
  };

  return (
    <Container maxW="100%" centerContent p={containerPadding}>
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

      <VStack spacing={6} mt={4}>
        <Box
          w={wheelSize}
          h={wheelSize}
          borderRadius="full"
          borderWidth="4px"
          borderColor="transparent"
          position="relative"
        >
          {pokemonList.map((pokemon, index) => {
            const angle = index * (360 / pokemonList.length);
            const radius = parseInt(wheelSize) / 2 - parseInt(pokemonSize) / 2;
            const position = getPosition(angle, radius);
            const { opacity, scale } = getOpacityAndScale(pokemon);
            return (
              <Image
                key={pokemon.name}
                src={pokemon.image}
                position="absolute"
                top="50%"
                left="50%"
                transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${scale})`}
                width={pokemonSize}
                height={pokemonSize}
                alt={pokemon.name}
                opacity={opacity}
                transition="opacity 0.1s, transform 0.1s"
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
          {/* Add the line */}
          {/* {(spinning || winningPokemon) && (
            <svg
              width={wheelSize}
              height={wheelSize}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <line {...getLineCoordinates()} stroke="black" strokeWidth="2" />
            </svg>
          )} */}
        </Box>

        <VStack mt={4}>
          <Text fontSize={["lg", "xl"]} fontWeight="bold" textAlign="center">
            {countdown !== null
              ? "Get ready..."
              : spinning
              ? "Spinning..."
              : result
              ? `You got: ${result.name}!`
              : "Spin the wheel!"}
          </Text>

          <Button
            ref={spinButtonRef}
            colorScheme="blue"
            onClick={startCountdown}
            isDisabled={spinning || countdown !== null}
            isLoading={spinning}
            size={["md", "lg"]}
          >
            {spinning
              ? ""
              : countdown !== null
              ? `Starting in ${countdown}...`
              : "Spin the Wheel"}
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
