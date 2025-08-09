import React, { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
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
  ModalProps,
} from '@chakra-ui/react';
import { AvatarInput } from '@/lib/inputs/AvatarInput/AvatarInput';

export interface SelectImageModalProps
  extends Pick<ModalProps, 'onClose' | 'isOpen'> {
  onChange: (value: Blob) => void;
}

export const SelectImageModal = ({
  isOpen,
  onChange,
  onClose,
}: SelectImageModalProps) => {
  const [blob, setBlob] = useState<Blob>();

  const handleSelect = () => {
    if (blob) {
      onChange(blob);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Profile Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={2}>
          <AvatarInput onChange={setBlob} />
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSelect}>
              Select
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
