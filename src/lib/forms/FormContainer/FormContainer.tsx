import { BoxProps, VStack } from '@chakra-ui/react';
import { FormEventHandler, PropsWithChildren } from 'react';

interface FormContainerProps
  extends Pick<BoxProps, 'width'>, PropsWithChildren {
  name: string;
  onSubmit?:
    | (FormEventHandler<HTMLDivElement> & FormEventHandler<HTMLFormElement>)
    | undefined;
}

export const FormContainer = ({ children, ...props }: FormContainerProps) => {
  return (
    <VStack
      as="form"
      {...props}
      justifyItems="stretch"
      alignItems="stretch"
      height={'full'}
    >
      {children}
    </VStack>
  );
};
