import { CreateScopeValueDto } from "@/models";
import { VStack, FormControl, FormLabel, Input, FormHelperText, Textarea } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";

interface ScopeValueFormProps extends Omit<UseFormReturn<CreateScopeValueDto>, 'handleSubmit' | 'reset'> { }

export const ScopeValueForm = ({ register }: ScopeValueFormProps) => (
    <VStack width="full" gap={3}>
        <FormControl>
            <FormLabel>Value</FormLabel>
            <Input type='text' {...register('name')} />
            <FormHelperText>e.g. Respect each other&apos;s time</FormHelperText>
        </FormControl>
        <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea {...register('description')} />
            <FormHelperText>e.g. Don&apos;t let meetings over run</FormHelperText>
        </FormControl>
    </VStack>
);