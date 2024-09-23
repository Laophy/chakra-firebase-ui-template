import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Image, VStack } from "@chakra-ui/react";
import { motion, useMotionValue, animate } from "framer-motion";

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
  const [cards, setCards] = useState([]);
  const [displayCards, setDisplayCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef(null);

  const totalCardsInView = 5;
  const x = useMotionValue(0);

  useEffect(() => {
    const fetchPokemonCards = async () => {
      let fetchedCards = [];
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=set.id:base5`
      );
      const data = await response.json();
      fetchedCards = data.data.map((card) => ({
        id: card.id,
        name: card.name,
        image: card.images.small,
      }));

      const shuffledCards = fetchedCards.sort(() => 0.5 - Math.random());
      const bigList = [];
      for (let i = 0; i < 5; i++) {
        bigList.push(...shuffledCards);
      }
      setCards(bigList);
      setDisplayCards(bigList);
      setInitialPosition(bigList);
    };

    fetchPokemonCards();
  }, []);

  const totalDuration = 5;

  const setInitialPosition = (cardList) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth / totalCardsInView;
      const randomIndex = Math.floor(Math.random() * cardList.length);
      const targetPosition = randomIndex * cardWidth;
      const centerPosition = containerWidth / 2 - cardWidth / 2;
      const initialX = -targetPosition + centerPosition;

      x.set(initialX);
    }
  };

  const handleSpin = () => {
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
      duration: totalDuration,
      ease: [0.1, 0.9, 0.2, 1],
      onComplete: () => {
        setIsLoading(false);
        setIsSpinning(false);
      },
    });
  };

  const MotionBox = motion(Box);

  return (
    <Box width="100%" overflow="hidden">
      <Button onClick={handleSpin} isLoading={isLoading} mb={4}>
        Spin
      </Button>
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
    </Box>
  );
};

const Battle = () => {
  return (
    <Box>
      <VStack>
        <PokemonCarousel />
        <PokemonCarousel />
      </VStack>
    </Box>
  );
};

export default Battle;
