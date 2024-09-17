// importing the required chakra libraries
import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";

// Custom Chakra UI theme
const theme = extendTheme(
  {
    colors: {
      brand: baseTheme.colors.gray,
    },
    fonts: {
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
