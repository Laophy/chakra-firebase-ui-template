import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  HStack,
  VStack,
  Text,
  Spinner,
  Center,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Skeleton,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { getAllProducts } from "../../../services/ProductManagement.service"; // Assuming you have this service

const ProductManager = ({ crate, setCrate }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [products, errorResponse] = await getAllProducts();
        if (errorResponse) {
          setError(errorResponse.message);
        } else {
          setAllProducts(products);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProductToCrate = (productId) => {
    setCrate((prev) => {
      if (!prev.products.some((prod) => prod.product === productId)) {
        return {
          ...prev,
          products: [
            ...prev.products,
            { product: productId, minTicket: 0, maxTicket: 0, odds: 100 },
          ],
        };
      }
      return prev;
    });
  };

  const removeProductFromCrate = (productId) => {
    setCrate((prev) => ({
      ...prev,
      products: prev.products.filter((prod) => prod.product !== productId),
    }));
  };

  if (loading) return <Spinner />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <HStack spacing={8} alignItems="flex-start">
      <VStack flex={1} alignItems="flex-start">
        <Text fontSize="xl" fontWeight="bold">
          Products in Crate
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="16px">
          {crate.products.map((prod) => {
            const product = allProducts.find(
              (p) => p.productId === prod.product
            );
            return (
              <Card
                key={prod.product}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.5)"
                height="100%"
              >
                <CardBody display="flex" flexDirection="column">
                  <Box position="relative" flex="1" borderRadius="xl">
                    <Box
                      borderRadius="lg"
                      height="200px"
                      mx="auto"
                      overflow="hidden"
                    >
                      <Image
                        src={product ? product.imageUrl : ""}
                        alt={product ? product.name : "Unknown Product"}
                        borderRadius="lg"
                        height="100%"
                        width="100%"
                        objectFit="contain"
                        p={2}
                        fallback={<Skeleton height="100%" width="100%" />}
                      />
                    </Box>
                  </Box>
                  <Stack mt="5" spacing="3" flex="1">
                    <Heading size="md" isTruncated>
                      {product ? product.name : "Unknown Product"}
                    </Heading>
                    <Button
                      mt={2}
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeProductFromCrate(prod.product)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </VStack>
      <VStack flex={1} alignItems="flex-start">
        <Text fontSize="xl" fontWeight="bold">
          All Products
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="16px">
          {allProducts.map((product) => (
            <Card
              key={product.productId}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.5)"
              height="100%"
            >
              <CardBody display="flex" flexDirection="column">
                <Box position="relative" flex="1" borderRadius="xl">
                  <Box
                    borderRadius="lg"
                    height="200px"
                    mx="auto"
                    overflow="hidden"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      borderRadius="lg"
                      height="100%"
                      width="100%"
                      objectFit="contain"
                      p={2}
                      fallback={<Skeleton height="100%" width="100%" />}
                    />
                  </Box>
                </Box>
                <Stack mt="5" spacing="3" flex="1">
                  <Heading size="md" isTruncated>
                    {product.name}
                  </Heading>
                  <Button
                    mt={2}
                    size="sm"
                    colorScheme="teal"
                    onClick={() => addProductToCrate(product.productId)}
                  >
                    Add to Crate
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </HStack>
  );
};

export default ProductManager;
