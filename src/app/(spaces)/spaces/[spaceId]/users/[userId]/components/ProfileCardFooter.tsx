import { Button, ButtonProps, HStack } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { ICONS } from '@/lib/icons/icons';
import { MouseEventHandler } from 'react';

interface ProfileCardFooterProps {
  BusyButton: (props: ButtonProps) => JSX.Element;
  dateLabel?: string;
  dateValue: Date;
  isDirty: boolean;
  isEditing: boolean;
  onCancelClick: MouseEventHandler;
}

export const ProfileCardFooter = ({
  BusyButton,
  isDirty,
  isEditing,
  onCancelClick,
}: ProfileCardFooterProps) => {
  return (
    <HStack w="full">
      {isEditing && (
        <HStack>
          <Button onClick={onCancelClick} variant="outline">
            Cancel
          </Button>
          <BusyButton
            type="submit"
            isDisabled={!isDirty}
            rightIcon={<Icon as={ICONS.SaveIcon} />}
          >
            Save
          </BusyButton>
        </HStack>
      )}
    </HStack>
  );
};
