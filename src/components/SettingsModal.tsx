import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { FaSun, FaWrench } from "react-icons/fa"

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
              <h1>Coming soon...</h1>
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