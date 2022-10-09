import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { StyleConfig, mode } from "@chakra-ui/theme-tools";
import { type StyleFunctionProps, MultiStyleConfig  } from '@chakra-ui/styled-system'

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const components: Record<string, StyleConfig> = {
  // ProSidebar: {
  //   baseStyle: ({ colorMode }) => ({
  //     bg: colorMode === "dark" ? "red.300" : "green.500",
  //     color: colorMode === "dark" ? "red" : "red",
  //     padding: '10px'
  //   })
  // },
}

// const multiPartComponent: Record<string, MultiStyleConfig> = {
//   ProSidebar: {
//     parts: ["SidebarHeader", "SidebarContent", "SidebarFooter"],
//     baseStyle: {
//       SidebarHeader: {

//       }
//     }
//   },
// }

const colors: Record<string, StyleConfig> = {
}

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode('rgb(55, 53, 47)', 'rgba(255, 255, 255, 0.81)')(props),
      bg: mode('whiteAlpha.900', 'rgb(25, 25, 25)')(props),
    },
  })
}

const theme = extendTheme({ config, components, colors, styles })

export default theme