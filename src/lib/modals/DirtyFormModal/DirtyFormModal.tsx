import { useFormContext } from 'react-hook-form';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBoolean,
} from '@chakra-ui/react';
import { useEffect } from 'react';

interface DirtyFormModalProps {
  isDirty?: boolean;
}

const invalidStateError =
  'A DirtyFormModal is in an invalid state. ' +
  'Ensure that the component is wrapped in a FormProvider or that the isDirty prop is specified.';

export const DirtyFormModal = ({ isDirty }: DirtyFormModalProps) => {
  const form = useFormContext();
  const [isOpen, { on: _showModal, off: dismissModal }] = useBoolean();
  const [_isConfirmed, { on: confirm, off: reset }] = useBoolean();
  isDirty ??= form?.formState.isDirty;

  useEffect(reset, [isDirty, reset]);

  if (isDirty === undefined) {
    console.warn(invalidStateError);
  }

  //TODO: The useDirtyFormWarning hook that is necessary for this component to work was broken with the
  // introduction of the new Next.js router. There is currently no equivalent solution. The Next.js
  // team has an item on their roadmap to introduce similar functionality to the new router.

  const handleConfirm = () => {
    dismissModal();
    confirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={dismissModal}>
      <ModalOverlay />
      <ModalContent maxW="xl">
        <ModalHeader>Unsaved changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody minH="unset">
          There are unsaved changes on the current page. Are you sure you want
          to leave?
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button onClick={dismissModal} variant="outline">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Okay
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
