import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { Home } from "./pages/Home"
import { MyCustomRouter } from "./Router"
import './styles/style.scss'

export const App = () => (
  <ChakraProvider theme={theme}>
    <MyCustomRouter />
  </ChakraProvider>
)