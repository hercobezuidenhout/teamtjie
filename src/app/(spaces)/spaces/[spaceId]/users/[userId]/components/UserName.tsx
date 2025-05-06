import { useFormContext } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';
import { FormInput } from '@/lib/inputs/FormInput/FormInput';

interface UserNameProps {
  isEditing: boolean;
}

const defaultUserName = 'John Doe';

export const UserName = ({ isEditing }: UserNameProps) => {
  const { watch } = useFormContext();

  return isEditing ? (
    <FormInput name="name" required />
  ) : (
    <Heading size="md">{watch('name') ?? defaultUserName}</Heading>
  );
};
