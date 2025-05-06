import { useFormContext } from 'react-hook-form';
import { Text } from '@chakra-ui/react';
import { FormInput } from '@/lib/inputs/FormInput/FormInput';

interface ProfileDescriptionProps {
  descriptionName: string;
  fallbackDescription?: string;
  isEditing: boolean;
}

export const ProfileDescription = ({
  descriptionName,
  fallbackDescription,
  isEditing,
}: ProfileDescriptionProps) => {
  const { watch } = useFormContext();

  return isEditing ? (
    <FormInput name={descriptionName} multiLine />
  ) : (
    <Text fontWeight="medium" noOfLines={8} whiteSpace="pre-line">
      {watch(descriptionName) ?? fallbackDescription}
    </Text>
  );
};
