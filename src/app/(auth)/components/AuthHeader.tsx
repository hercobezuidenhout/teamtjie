'use client';

import { Button, HStack, Icon, IconButton, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiX } from 'react-icons/fi';

interface AuthHeaderProps {
  signup?: boolean;
}

export const AuthHeader = ({ signup }: AuthHeaderProps) => {
  const router = useRouter();

  return (
    <HStack padding={5} justifyContent="space-between" alignItems="center">
      <IconButton variant="ghost" aria-label="Close" icon={<Icon as={FiX} onClick={() => router.back()} />} />
      {!signup
        ? (
          <Link href='/signup'>
            <Button variant="link">Sign Up</Button>
          </Link>
        )
        : (
          <Link href='/login'>
            <Button variant="link">Login</Button>
          </Link>
        )}
    </HStack>
  );
};