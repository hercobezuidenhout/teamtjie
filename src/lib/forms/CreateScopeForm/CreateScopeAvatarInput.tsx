'use client';

import {
  Avatar,
  Button,
  Center,
  Fade,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ICONS } from '@/lib/icons/icons';
import { Fragment, useRef, useState } from 'react';
import { useHover } from 'react-use';
import { useModal } from '@/lib/hooks/useModal';
import { SelectImageModal } from '@/lib/modals/SelectImageModal/SelectImageModal';

interface CreateScopeAvatarInputProps {
  value: Blob | undefined;
  onChange: (value: Blob) => void;
}

export const CreateScopeAvatarInput = ({
  value,
  onChange,
}: CreateScopeAvatarInputProps) => {
  const [src, setSrc] = useState<string>('');
  const ref = useRef<HTMLButtonElement>(null);
  const [Modal, { showModal }] = useModal(SelectImageModal);

  const HoverableAvatar = (hovered: boolean) =>
    value ? (
      <Avatar size="xl" src={src} ref={ref}>
        <Fade in={hovered}>
          <IconButton
            aria-label="Edit profile image"
            position="absolute"
            variant="primary"
            size="xs"
            top="0"
            right="0"
            icon={<Icon as={ICONS.EditIcon} />}
            onClick={showModal}
          />
        </Fade>
      </Avatar>
    ) : (
      <Fragment />
    );

  const [hoverableAvatar] = useHover(HoverableAvatar);

  const handleBlobSelected = (blob: Blob) => {
    onChange(blob);
    setSrc(URL.createObjectURL(blob));
  };

  return (
    <>
      <Modal onChange={handleBlobSelected} />
      {value ? (
        hoverableAvatar
      ) : (
        <Center
          as={Button}
          onClick={showModal}
          minH={24}
          minW={24}
          borderRadius="full"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="chakra-subtle-text"
        >
          <VStack spacing={0} color="chakra-subtle-text">
            <Icon as={ICONS.PictureIcon} fontSize="3xl" />
            <Text>Upload</Text>
          </VStack>
        </Center>
      )}
    </>
  );
};
