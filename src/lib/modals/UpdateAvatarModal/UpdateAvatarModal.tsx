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
  useToast,
} from '@chakra-ui/react';
import { getErrorMessage } from '@/utils/http-utils';
import { AvatarInput } from '@/lib/inputs/AvatarInput/AvatarInput';
import { useUploadAvatar } from '@/services/avatar/mutations/avatar-mutations';

export interface UpdateAvatarModalProps
  extends Pick<ModalProps, 'onClose' | 'isOpen'> {
  profileId: number | string;
  profileType: 'USER' | 'SCOPE';
}

export const UpdateAvatarModal = ({
  isOpen,
  onClose,
  profileId,
  profileType,
}: UpdateAvatarModalProps) => {
  const { mutateAsync, isPending: isUploading } = useUploadAvatar(profileType);
  const toast = useToast();
  const [blob, setBlob] = useState<Blob>();

  const handleUpload = async () => {
    if (!blob) {
      return;
    }

    const upload = async () => {
      await mutateAsync({
        id: profileId,
        avatar: blob,
      });
    };

    try {
      await upload();
      toast({ status: 'success', title: 'Profile image updated' });
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        status: 'error',
        title: errorMessage ?? 'Failed to upload file',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
      <ModalOverlay />
      <ModalContent backgroundColor="chakra-card-bg">
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
            <Button isLoading={isUploading} variant="primary" onClick={handleUpload}>
              Upload
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
