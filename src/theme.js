// importing the required chakra libraries
import { theme as chakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
	brand: {
		900: "#1a365d",
		800: "#153e75",
		700: "#2a69acc",
	},
};

const fonts = {
	body: "Urbanist, sans-serif",
	heading: "Urbanist, sans-serif",
	mono: "Urbanist, sans-serif",
};

// Custom Chakra UI theme
const theme = extendTheme({ colors, fonts });

export default theme;
