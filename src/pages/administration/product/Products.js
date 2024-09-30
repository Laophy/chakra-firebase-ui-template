import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Image,
  Badge,
  CardBody,
  Card,
  Stack,
  Heading,
  Tag,
  HStack,
  Input,
  Button,
  Container,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Textarea,
  Select,
  Skeleton,
  Switch,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProductById, // Import the delete function
} from "../../../services/ProductManagement.service";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
import { formatMoney } from "../../../utilities/Formatter";
import { FaCopy, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { useSelector } from "react-redux";

const ProductEditor = ({ onBack, product }) => {
  const user = useSelector((state) => state.data.user.user);
  const authHeader = useSelector((state) => state.data.user.authHeader);

  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  };

  const [newProduct, setNewProduct] = useState(
    product || {
      visibility: "private",
      productId: crypto.randomUUID(),
      name: "Lorem Ipsum Product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      price: 19.99,
      category: "uncategorized",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Product_sample_icon_picture.png/640px-Product_sample_icon_picture.png",
      attributes: {
        rarity: "common",
      },
      canBeShipped: false,
      purchaseUrl: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("attributes.")) {
      const attrName = name.split(".")[1];
      setNewProduct((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [attrName]: value },
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    console.log(newProduct);
    try {
      let response, errorResponse;
      if (product) {
        [response, errorResponse] = await updateProduct(authHeader, newProduct);
        if (errorResponse) {
          showToast("Error", errorResponse.message, "error");
        } else {
          showToast("Success", "Product updated successfully", "success");
        }
      } else {
        [response, errorResponse] = await createProduct(authHeader, newProduct);
        if (errorResponse) {
          showToast("Error", errorResponse.message, "error");
        } else {
          showToast("Success", "Product added successfully", "success");
        }
      }
      if (!errorResponse) {
        onBack(); // Call onBack after saving or updating
      }
    } catch (error) {
      showToast("Error", "Failed to save product changes", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const [response, errorResponse] = await deleteProductById(
        authHeader,
        newProduct.productId
      );
      if (errorResponse) {
        showToast(
          "Error",
          errorResponse.message || "Failed to delete product",
          "error"
        );
      } else {
        showToast("Success", "Product deleted successfully", "warning");
        onBack(); // Call onBack after deleting
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container as={Stack} maxW={"7xl"}>
      <Button
        onClick={onBack}
        variant={"solid"}
        size={"md"}
        mb={4}
        alignSelf={"flex-start"}
        leftIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
      <HStack alignItems={"flex-start"} spacing={8}>
        <Box flex={1}>
          <HStack spacing={4} mb={4}>
            <FormControl id="visibility">
              <FormLabel>Visibility</FormLabel>
              <Select
                name="visibility"
                value={newProduct.visibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </FormControl>
            <FormControl id="productId">
              <FormLabel>Product ID</FormLabel>
              <Input
                type="text"
                name="productId"
                value={newProduct.productId}
                onChange={handleChange}
              />
            </FormControl>
          </HStack>
          <FormControl id="name" mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              height="100px"
            />
          </FormControl>
          <HStack spacing={4} mb={4}>
            <FormControl id="price">
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="category">
              <FormLabel>Category</FormLabel>
              <Input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
              />
            </FormControl>
          </HStack>
          <FormControl id="imageUrl" mb={4}>
            <FormLabel>Image URL</FormLabel>
            <HStack>
              <Input
                type="text"
                name="imageUrl"
                value={newProduct.imageUrl}
                onChange={handleChange}
              />
              <Box boxSize="40px">
                {newProduct.imageUrl ? (
                  <Image
                    src={newProduct.imageUrl}
                    alt="Product Image"
                    boxSize="100%"
                    objectFit="cover"
                    borderRadius="md"
                  />
                ) : (
                  <Skeleton boxSize="100%" borderRadius="md" />
                )}
              </Box>
            </HStack>
          </FormControl>
          <FormControl id="canBeShipped" mb={4}>
            <FormLabel>Shipable</FormLabel>
            <HStack>
              <Switch
                defaultChecked={newProduct.canBeShipped}
                onChange={(e) =>
                  handleChange({
                    target: { name: "canBeShipped", value: e.target.checked },
                  })
                }
              />
              <Input
                type="text"
                name="purchaseUrl"
                placeholder="Purchase URL"
                value={newProduct.purchaseUrl}
                onChange={handleChange}
              />
            </HStack>
          </FormControl>
          <FormControl id="rarity" mb={4}>
            <FormLabel>Rarity</FormLabel>
            <RadioGroup
              name="attributes.rarity"
              value={newProduct.attributes.rarity} // Ensure value is used
              onChange={(value) =>
                handleChange({ target: { name: "attributes.rarity", value } })
              }
            >
              <Stack direction="row">
                <Radio value="common" colorScheme="green">
                  Common
                </Radio>
                <Radio value="uncommon" colorScheme="blue">
                  Uncommon
                </Radio>
                <Radio value="rare" colorScheme="purple">
                  Rare
                </Radio>
                <Radio value="legendary" colorScheme="yellow">
                  Legendary
                </Radio>
              </Stack>
            </RadioGroup>
            <HStack justifyContent="space-between" mt={4}>
              <Button
                onClick={handleSave}
                variant={"solid"}
                colorScheme={"teal"}
                size={"md"}
                leftIcon={<FaSave />}
              >
                Save
              </Button>
              {product && (
                <Button
                  onClick={handleDelete}
                  variant={"solid"}
                  colorScheme={"red"}
                  size={"md"}
                  leftIcon={<FaTrash />}
                >
                  Delete
                </Button>
              )}
            </HStack>
          </FormControl>
        </Box>
        <Box flex={1}>{renderProductCard(newProduct)}</Box>
      </HStack>
    </Container>
  );
};

const renderProductCard = (product) => (
  <Card
    key={product.productId}
    borderRadius="lg"
    overflow="hidden"
    boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)"
    _hover={{ transform: "scale(1.01)", transition: "transform 0.2s" }}
    height="100%" // Ensure the card takes full height
  >
    <CardBody display="flex" flexDirection="column">
      <Box position="relative" flex="1">
        <Image
          src={product.imageUrl}
          alt={product.name}
          borderRadius="lg"
          height="200px"
          objectFit="cover"
          mx="auto"
          mt={5}
          fallback={<Skeleton height="300px" />}
        />
      </Box>
      <Stack mt="5" spacing="3" flex="1">
        <Tag
          position="absolute"
          top="2"
          left="2"
          variant={"solid"}
          colorScheme={product.visibility === "public" ? "green" : "black"}
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          {product.visibility}
        </Tag>
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <Tag
            colorScheme="blue"
            variant={"solid"}
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {product.category}
          </Tag>
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
        </HStack>
        <Heading size="md" isTruncated>
          {product.name}
        </Heading>
        <Text>
          {product.description.length > 200
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Text>
        <Text color="blue.600" fontSize="2xl">
          {formatMoney(product.price)}
        </Text>
      </Stack>
    </CardBody>
  </Card>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [fetchedProducts, failedProductsResponse] =
          await getAllProducts();
        if (failedProductsResponse) {
          setError(failedProductsResponse.message);
          console.log(failedProductsResponse);
        } else {
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedProduct, isEditing]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.attributes.rarity
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  if (loading)
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  if (error)
    return (
      <Center>
        <Text>Error: {error}</Text>
      </Center>
    );

  return isEditing ? (
    <ProductEditor
      onBack={() => {
        setIsEditing(false);
        setSelectedProduct(null);
      }}
      product={selectedProduct}
    />
  ) : (
    <Container as={Stack} maxW={"7xl"}>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Button
          onClick={() => setIsEditing(true)}
          variant={"solid"}
          size={"md"}
          leftIcon={<LuPlus />}
        >
          New Product
        </Button>
        <Box display={"flex"} alignItems={"center"}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Box>
      </HStack>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="16px">
        {filteredProducts.map((product) => (
          <Box
            key={product.productId}
            onClick={() => handleProductClick(product)}
          >
            {renderProductCard(product)}
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Products;
