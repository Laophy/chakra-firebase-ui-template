import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Heading,
  Button,
  VStack,
  Text,
  Box,
  Circle,
  Image,
  Center,
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

    const totalSpins = 5 + Math.random() * 5; // 5 to 10 full rotations
    const totalRotation = totalSpins * 360;
    const duration = 5000; // 5 seconds
    const fps = 90;
    const frames = duration / (1000 / fps);
    let currentFrame = 0;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out function
      const currentRotation = totalRotation * easeOut;
      setRotation(currentRotation);

      // Set isSpinEnding to true when we're in the last 10% of the animation
      if (progress > 0.9 && !isSpinEnding) {
        setIsSpinEnding(true);
      }

      if (currentFrame >= frames) {
        clearInterval(spinIntervalRef.current);
        setSpinning(false);
        const finalPokemon = getSelectedPokemon(
          currentRotation,
          currentPokemonList
        );
        setResult(finalPokemon);
        setWinningPokemon(finalPokemon);
        setShowConfetti(true);

        // Hide confetti after 1 second
        setTimeout(() => setShowConfetti(false), 1000);
      }
    }, 1000 / fps);

    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
    }, duration);
  };

  const getSelectedPokemon = (currentRotation, currentPokemonList) => {
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const index = Math.floor(
      normalizedRotation / (360 / currentPokemonList.length)
    );
    return currentPokemonList[index];
  };

  const getOpacityAndScale = (pokemon) => {
    if (!winningPokemon || spinning) {
      const segmentSize = 360 / pokemonList.length;
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const pokemonAngle = pokemonList.indexOf(pokemon) * segmentSize;
      const distance = Math.abs(normalizedRotation - pokemonAngle);

      if (isSpinEnding) {
        // Use a smaller highlight zone when the spin is ending
        if (distance <= segmentSize / 4 || distance >= 360 - segmentSize / 4) {
          return { opacity: 1, scale: 1.2 };
        } else {
          return { opacity: 0.3, scale: 1 };
        }
      } else {
        // Use a larger highlight zone during normal spinning
        if (distance <= segmentSize / 2 || distance >= 360 - segmentSize / 2) {
          return { opacity: 1, scale: 1.2 };
        } else {
          return { opacity: 0.3, scale: 1 };
        }
      }
    } else {
      // After spinning, only highlight the winning Pokémon
      if (pokemon.name === winningPokemon.name) {
        return { opacity: 1, scale: 1.2 };
      } else {
        return { opacity: 0.3, scale: 1 };
      }
    }
  };

  const getPosition = (angle, radius) => {
    //const radius = 200; // Slightly smaller than half of the wheel's width/height
    const radian = angle * (Math.PI / 180);
    const x = Math.sin(radian) * radius;
    const y = -Math.cos(radian) * radius;
    return { x, y };
  };

  return (
    <Container maxW="6xl" centerContent>
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

      <VStack spacing={6} mt={10}>
        <Box
          w="400px"
          h="400px"
          borderRadius="full"
          borderWidth="4px"
          borderColor={"transparent"}
          position="relative"
        >
          {pokemonList.map((pokemon, index) => {
            const angle = index * (360 / pokemonList.length);
            const radius = 165;
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
                width="90px"
                height="90px"
                alt={pokemon.name}
                opacity={opacity}
                transition="opacity 0.1s, transform 0.1s"
              />
            );
          })}
          <Circle
            size="20px"
            bg="red.500"
            opacity={0}
            position="absolute"
            top="50%"
            left="50%"
            transform={`translate(${getPosition(rotation).x}px, ${
              getPosition(rotation).y
            }px)`}
            transition="transform 0.05s linear"
          />
          {countdown !== null && (
            <Center
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              fontSize="6xl"
              fontWeight="bold"
              borderRadius="full"
            >
              {countdown}
            </Center>
          )}
        </Box>

        <VStack mt={10}>
          <Text fontSize="xl" fontWeight="bold">
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
