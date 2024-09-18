// importing the required chakra libraries
import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";

// Custom Chakra UI theme
const theme = extendTheme(
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    palette: {
      mode: "dark",
    },
    colors: {
      brand: baseTheme.colors.gray,
    },
    fonts: {
      text: "Urbanist, sans-serif",
      body: "Urbanist, sans-serif",
      heading: "Urbanist, sans-serif",
      mono: "Urbanist, sans-serif",
    },
    styles: {
      global: {
        // styles for the `body`
        body: {},
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "gray" })
);

export default theme;
