import {
  ChakraProvider,
} from "@chakra-ui/react"
import { MyCustomRouter } from "./Router"
import theme from "./theme/ChakraTheme"
import './styles/style.scss'

export const App = () => (
  <ChakraProvider theme={theme}>
    <MyCustomRouter />
  </ChakraProvider>
)