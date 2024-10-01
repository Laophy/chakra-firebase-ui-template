import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Stack,
  Skeleton,
  CardFooter,
  Button,
  Icon,
  Heading,
  Flex,
  CardBody,
  Tag,
  Card,
  VStack,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { LuSword } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";
import { formatMoney } from "../../utilities/Formatter";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts } from "../../services/ProductManagement.service";

const WonItemsSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wonProducts, setWonProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [fetchedProducts, failedProductsResponse] =
          await getAllProducts();
        if (failedProductsResponse) {
          console.log(failedProductsResponse);
        } else {
          setProducts(fetchedProducts);
          setWonProducts(fetchedProducts.slice(0, 5));
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWonProducts((prevProducts) => {
        const nextProduct =
          products[
            (products.indexOf(prevProducts[prevProducts.length - 1]) + 1) %
              products.length
          ];
        return [nextProduct, ...prevProducts.slice(0, -1)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <VStack
      spacing={4}
      overflowY="auto"
      width="100%"
      p={4}
      overflowX="hidden"
      borderRadius="lg"
      maxH={`calc(100vh - 100px)`}
      alignItems="flex-start" // Align items to the left
      css={{
        "&::-webkit-scrollbar": { display: "none" },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <HStack alignItems="center" spacing={2}>
        <Box boxSize={2} bg="red.500" borderRadius="full" />
        <Text fontSize="sm" fontWeight="bold">
          Live Drops
        </Text>
      </HStack>
      <AnimatePresence>
        {wonProducts.map((product, index) => (
          <motion.div
            key={Math.random().toString(36).substr(2, 9)}
            initial={{ y: -50, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Card
              maxW="sm"
              width="100%"
              position="relative"
              boxShadow="0 0 10px rgba(66, 153, 225, 0.2)"
              borderColor="gray.600"
              transition="all 0.3s"
              _hover={{
                boxShadow: "0 0 20px rgba(66, 153, 225, 0.4)",
                filter: "brightness(1.1)",
              }}
            >
              <Box position="absolute" top={2} left={2} zIndex={1}>
                <Tag size="md" variant="solid" bg="blue.600">
                  {formatMoney(product.price)}
                </Tag>
              </Box>
              <CardBody>
                <Flex justifyContent="center" alignItems="center">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    borderRadius="lg"
                    boxSize="250px"
                    objectFit="contain"
                  />
                </Flex>
                <Stack mt="4" spacing="3">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="xs">{product.name}</Heading>
                    <Badge
                      borderRadius="full"
                      px="2"
                      colorScheme={
                        product.attributes.rarity === "legendary"
                          ? "yellow"
                          : product.attributes.rarity === "rare"
                          ? "purple"
                          : product.attributes.rarity === "uncommon"
                          ? "blue"
                          : "green"
                      }
                    >
                      {product.attributes.rarity}
                    </Badge>
                  </Flex>
                </Stack>
              </CardBody>
              <CardFooter>
                {(() => {
                  const isViewBattle = Math.random() < 0.5;
                  return (
                    <Button
                      variant="solid"
                      colorScheme={isViewBattle ? "blue" : "yellow"}
                      width="100%"
                      leftIcon={
                        isViewBattle ? (
                          <Icon as={LuSword} />
                        ) : (
                          <Icon as={FaBoxOpen} />
                        )
                      }
                    >
                      {isViewBattle ? "View Battle" : "Open Box"}
                    </Button>
                  );
                })()}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </VStack>
  );
};

export default WonItemsSlider;
