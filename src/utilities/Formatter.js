import { HStack, Text } from "@chakra-ui/react";
import { FaRegGem } from "react-icons/fa";

export const formatMoney = (value) => {
  let formattedAmount = value;
  let percicion = 3;

  if (value >= 1e18) {
    formattedAmount = (value / 1e18).toFixed(percicion) + "q"; // Quintillions
  } else if (value >= 1e15) {
    formattedAmount = (value / 1e15).toFixed(percicion) + "qa"; // Quadrillions
  } else if (value >= 1e12) {
    formattedAmount = (value / 1e12).toFixed(percicion) + "t"; // Trillions
  } else if (value >= 1e9) {
    formattedAmount = (value / 1e9).toFixed(percicion) + "b"; // Billions
  } else if (value >= 1e6) {
    formattedAmount = (value / 1e6).toFixed(percicion) + "m"; // Millions
  } else if (value >= 1e3) {
    formattedAmount = (value / 1e3).toFixed(percicion) + "k"; // Thousands
  }

  return (
    <HStack>
      <FaRegGem color="lightblue" />
      <Text>{formattedAmount}</Text>
    </HStack>
  );
};
