import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Textarea,
} from '@chakra-ui/react';
import {
  Controller,
  FieldValues,
  useFormContext,
  Validate,
} from 'react-hook-form';
import { HTMLInputTypeAttribute } from 'react';

export interface FormInputProps extends Pick<InputProps, 'size'> {
  name: string;
  label?: string;
  defaultValue?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  max?: number;
  min?: number;
  multiLine?: boolean;
  validate?:
  | Validate<unknown, FieldValues>
  | Record<string, Validate<unknown, FieldValues>>;
}

export const FormInput = ({
  name,
  label,
  defaultValue = '',
  helperText,
  required,
  type,
  max,
  min,
  multiLine,
  placeholder,
  validate,
  ...inputProps
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: { value: !!required, message: 'Required' },
        ...(min
          ? {
            minLength: {
              value: min,
              message: `${min} characters or more`,
            },
          }
          : {}),
        ...(max
          ? {
            maxLength: {
              value: max,
              message: `${max} characters or less`,
            },
          }
          : {}),
        validate,
      }}
      render={({ field, fieldState: { invalid, error } }) => (
        <FormControl isInvalid={invalid}>
          {label && <FormLabel>{label}</FormLabel>}
          <InputGroup>
            {multiLine ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                _readOnly={{ bgColor: 'gray.100' }}
                {...inputProps}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                _readOnly={{ bgColor: 'gray.100' }}
                {...inputProps}
                pr={12}
              />
            )}
            {max && (
              <InputRightElement
                color="chakra-subtle-text"
                pointerEvents="none"
                width={12}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
                pr={4}
              >
                {max}
              </InputRightElement>
            )}
          </InputGroup>
          {!error ? (
            helperText && <FormHelperText>{helperText}</FormHelperText>
          ) : (
            <FormErrorMessage>{error.message || 'Invalid'}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
};
