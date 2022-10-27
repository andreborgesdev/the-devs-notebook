import { Button, FormControl, FormLabel, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Switch, useDisclosure } from "@chakra-ui/react"
import { FaWrench } from "react-icons/fa"
import { Text } from "@chakra-ui/react"

export const SettingsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <IconButton onClick={onOpen} icon={<FaWrench />} background={"transparent"} aria-label='Search database' />
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>The settings will allow you to customize the content to your preference to make the read experience more pleasant.</Text>
              <br /> 
              <FormControl display='flex' flexDirection='column' alignItems='center'>
                <FormLabel htmlFor='small-text' mb='0'>
                  Small text
                </FormLabel>
                <Switch id='small-text' />
                <FormLabel htmlFor='full-width' mb='0'>
                  Full width
                </FormLabel>
                <Switch id='full-width' />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
                {/* <Button colorScheme='green' mr={3} onClick={onClose}>
                    Save
                </Button> */}
                <Button variant={"ghost"} onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }