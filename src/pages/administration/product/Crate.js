import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Image,
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
  Textarea,
  Select,
  Skeleton,
  IconButton,
  useToast,
  Icon,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  InfoIcon,
  RepeatIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { formatMoney } from "../../../utilities/Formatter";
import { FaSave, FaTrash } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { useSelector } from "react-redux";
import {
  getAllCrates,
  updateCrate,
  createCrate,
  deleteCrateById,
} from "../../../services/CrateManagement.service";
import ProductManager from "./ProductManager"; // Import the new component

const ProductEditor = ({ onBack, crate }) => {
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

  const [newCrate, setNewCrate] = useState(
    crate || {
      visibility: "private",
      crateId: crypto.randomUUID(),
      name: "Mystery Crate",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      price: 100,
      category: "mix",
      tag: "new",
      imageUrl:
        "https://imgix.hypedrop.com/images/HypeDrop_Blaze_Box_Design_Export.png?auto=format",
      products: [], // Initialize products array
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("attributes.")) {
      const attrName = name.split(".")[1];
      setNewCrate((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [attrName]: value },
      }));
    } else {
      setNewCrate((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      let response, errorResponse;
      if (crate) {
        console.log("updating the crate");
        [response, errorResponse] = await updateCrate(authHeader, newCrate);
        if (errorResponse) {
          showToast("Error", errorResponse.message, "error");
        } else {
          showToast("Success", "Crate updated successfully", "success");
        }
      } else {
        console.log("creating a new crate");
        [response, errorResponse] = await createCrate(authHeader, newCrate);
        if (errorResponse) {
          showToast("Error", errorResponse.message, "error");
        } else {
          showToast("Success", "Crate added successfully", "success");
        }
      }
      if (!errorResponse) {
        onBack(); // Call onBack after saving or updating
      }
    } catch (error) {
      showToast("Error", "Failed to save crate changes", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const [response, errorResponse] = await deleteCrateById(
        authHeader,
        newCrate.crateId
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

      <HStack
        alignItems={"flex-start"}
        spacing={8}
        flexDirection={{ base: "column", md: "row" }} // Adjust direction for mobile
        width="100%" // Make full width on mobile
      >
        <Box flex={1} width={{ base: "100%", md: "auto" }}>
          {" "}
          {/* Make full width on mobile */}
          <HStack spacing={4} mb={4} width="100%">
            {" "}
            {/* Make full width on mobile */}
            <FormControl id="visibility" width="100%">
              {" "}
              {/* Make full width on mobile */}
              <FormLabel>Visibility</FormLabel>
              <Select
                name="visibility"
                value={newCrate.visibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </FormControl>
            <FormControl id="crateId" width="100%">
              {" "}
              {/* Make full width on mobile */}
              <FormLabel>Product ID</FormLabel>
              <HStack>
                <Input
                  type="text"
                  name="crateId"
                  value={newCrate.crateId}
                  onChange={handleChange}
                />
                <IconButton
                  aria-label="Generate new Product ID"
                  icon={<RepeatIcon />}
                  onClick={() =>
                    setNewCrate({
                      ...newCrate,
                      crateId: crypto.randomUUID(),
                    })
                  }
                />
              </HStack>
            </FormControl>
          </HStack>
          <FormControl id="name" mb={4} width="100%">
            {" "}
            {/* Make full width on mobile */}
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={newCrate.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description" mb={4} width="100%">
            {" "}
            {/* Make full width on mobile */}
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newCrate.description}
              onChange={handleChange}
              height="100px"
            />
          </FormControl>
          <HStack spacing={4} mb={4} width="100%">
            {" "}
            {/* Make full width on mobile */}
            <FormControl id="price" width="100%">
              {" "}
              {/* Make full width on mobile */}
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={newCrate.price}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="category" width="100%">
              {" "}
              {/* Make full width on mobile */}
              <FormLabel>Category</FormLabel>
              <Input
                type="text"
                name="category"
                value={newCrate.category}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="tag" width="100%">
              {" "}
              {/* Make full width on mobile */}
              <FormLabel>Tag</FormLabel>
              <Input
                type="text"
                name="tag"
                value={newCrate.tag}
                onChange={handleChange}
              />
            </FormControl>
          </HStack>
          <FormControl id="imageUrl" mb={4} width="100%">
            {" "}
            {/* Make full width on mobile */}
            <FormLabel>Image URL</FormLabel>
            <HStack>
              <Input
                type="text"
                name="imageUrl"
                value={newCrate.imageUrl}
                onChange={handleChange}
              />
              <Box boxSize="40px">
                {newCrate.imageUrl ? (
                  <Image
                    src={newCrate.imageUrl}
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
          <FormControl id="rarity" mb={4} width="100%">
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
              {crate && (
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
        <Box
          flex={1}
          order={{ base: -1, md: 1 }}
          width={{ base: "100%", md: "auto" }}
        >
          {" "}
          {/* Make full width on mobile */} {/* Display on top for mobile */}
          {renderProductCard(newCrate)}
        </Box>
      </HStack>
      <ProductManager crate={newCrate} setCrate={setNewCrate} />
    </Container>
  );
};

const renderProductCard = (crate) => (
  <Card
    key={crate.crateId}
    borderRadius="lg"
    overflow="hidden"
    boxShadow="0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.5)"
    height="100%"
  >
    <CardBody display="flex" flexDirection="column">
      <Box position="relative" flex="1" borderRadius="xl">
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <Tag
            variant={"solid"}
            colorScheme={crate.visibility === "public" ? "green" : "black"}
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            m={2}
          >
            {crate.visibility}
          </Tag>
          <Tag
            variant={"solid"}
            colorScheme={crate.tag === "new" ? "green" : "blue"}
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            m={2}
          >
            {crate.tag}
          </Tag>
        </HStack>
        <Box borderRadius="lg" height="200px" mx="auto" overflow="hidden">
          <Image
            src={crate.imageUrl}
            alt={crate.name}
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
          {crate.name}
        </Heading>
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <Tag
            colorScheme="gray"
            variant={"solid"}
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {crate.category}
          </Tag>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="blue.600" fontSize="2xl">
            {formatMoney(crate.price)}
          </Text>
          <Icon icon={InfoIcon} color="blue.600" />
        </HStack>
      </Stack>
    </CardBody>
  </Card>
);

const Crates = () => {
  const [crates, setCrates] = useState([]);
  const [filteredCrates, setFilteredCrates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrate, setSelectedCrate] = useState(null);

  useEffect(() => {
    const fetchedCrates = async () => {
      try {
        const [fetchedCrates, failedCratesResponse] = await getAllCrates();
        if (failedCratesResponse) {
          setError(failedCratesResponse.message);
          console.log(failedCratesResponse);
        } else {
          setCrates(fetchedCrates);
          setFilteredCrates(fetchedCrates);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchedCrates();
  }, [selectedCrate, isEditing]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredCrates(crates);
    } else {
      setFilteredCrates(
        crates.filter(
          (crate) =>
            crate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crate.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            crate.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crate.attributes.rarity
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, crates]);

  const handleCrateClick = (crate) => {
    setSelectedCrate(crate);
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
        setSelectedCrate(null);
      }}
      crate={selectedCrate}
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
          New Crate
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
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="16px">
        {filteredCrates.map((crate) => (
          <Box key={crate.crateId} onClick={() => handleCrateClick(crate)}>
            {renderProductCard(crate)}
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Crates;
