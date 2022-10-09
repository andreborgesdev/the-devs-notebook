import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Home } from "./pages/Home"
import { PageLayout } from "./pages/PageLayout"
import { MyCustomRouter } from "./Router"
import './styles/style.scss'

export const App = () => (
  <ChakraProvider theme={theme}>
    <MyCustomRouter />
  </ChakraProvider>
)