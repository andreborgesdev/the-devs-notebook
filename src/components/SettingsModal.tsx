import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
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
              <Text fontSize={'xl'}>Coming soon...</Text>
              <br />
              <Text>The settings will allow you to customize the text part to your preference to make the read experience more pleasant.</Text>
            </ModalBody>
  
            <ModalFooter>
                <Button colorScheme='green' mr={3} onClick={onClose}>
                    Save
                </Button>
                <Button variant={"ghost"} onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }