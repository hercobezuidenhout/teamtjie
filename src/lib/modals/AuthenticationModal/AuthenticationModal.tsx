'use client'

import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { AuthenticationForm } from '../../forms/AuthenticationForm/AuthenticationForm';

interface AuthenticationModalProps
  extends Pick<ModalProps, 'onClose' | 'isOpen'> {
  title?: string;
  redirectTo?: string;
}

export const AuthenticationModal = ({
  isOpen,
  onClose,
  title,
  redirectTo,
}: AuthenticationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>{title || 'Welcome back!'}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AuthenticationForm width="full" redirectTo={redirectTo} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
