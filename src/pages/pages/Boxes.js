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
} from "@chakra-ui/react";

const pokemonList = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Mewtwo",
  "Eevee",
];

export default function Boxes() {
  const [pokemonList, setPokemonList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef(null);
  const spinIntervalRef = useRef(null);

  useEffect(() => {
    fetchRandomPokemon();
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  const fetchRandomPokemon = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
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
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  const getSelectedPokemon = (currentRotation) => {
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const index = Math.floor(normalizedRotation / (360 / pokemonList.length));
    return pokemonList[index];
  };

  const spinWheel = () => {
    setSpinning(true);
    setResult(null);

    const totalSpins = 5 + Math.random() * 5; // 5 to 10 full rotations
    const totalRotation = totalSpins * 360;
    const duration = 5000; // 5 seconds
    const fps = 60;
    const frames = duration / (1000 / fps);
    let currentFrame = 0;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out function
      const currentRotation = totalRotation * easeOut;
      setRotation(currentRotation);

      if (currentFrame >= frames) {
        clearInterval(spinIntervalRef.current);
        setSpinning(false);
        const finalPokemon = getSelectedPokemon(currentRotation);
        setResult(finalPokemon);
      }
    }, 1000 / fps);

    spinTimeoutRef.current = setTimeout(() => {
      setSpinning(false);
    }, duration);
  };

  return (
    <Container maxW="6xl" centerContent>
      <Heading as="h2" size="xl" my={6}>
        Pokémon Mystery Wheel
      </Heading>

      <VStack spacing={6}>
        <Box
          w="300px"
          h="300px"
          borderRadius="full"
          borderWidth="4px"
          // borderColor="blue.500"
          position="relative"
        >
          {pokemonList.map((pokemon, index) => (
            <Image
              key={pokemon.name}
              src={pokemon.image}
              position="absolute"
              top="35%"
              left="35%"
              transform={`rotate(${
                index * (360 / pokemonList.length)
              }deg) translateY(-150px) rotate(-${
                index * (360 / pokemonList.length)
              }deg)`}
              width="90px"
              height="90px"
              alt={pokemon.name}
            />
          ))}
          <Circle
            opacity={0.8}
            size="20px"
            bg="red.500"
            position="absolute"
            top="140px"
            left="calc(50% - 10px)"
            transform={`rotate(${rotation - 25}deg) translateY(-150px)`}
            transition="transform 0.05s linear"
          />
        </Box>

        <Text fontSize="xl" fontWeight="bold">
          {spinning
            ? "Spinning..."
            : result
            ? `You got: ${result.name}!`
            : "Spin the wheel!"}
        </Text>

        <Button colorScheme="blue" onClick={spinWheel} isDisabled={spinning}>
          {spinning ? "Spinning..." : "Spin the Wheel"}
        </Button>
      </VStack>
    </Container>
  );
}
