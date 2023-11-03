import App from "@/App";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/luckiest-guy";
import "@fontsource/noto-sans-kr";
import "@fontsource/roboto";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import theme from "./theme";

const rootElement = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
