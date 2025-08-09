'use client';

import { UpdateScopeDto } from "@/models";
import { FormControl, FormHelperText, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";

export interface EditScopeProfileFormProps extends Omit<UseFormReturn<UpdateScopeDto>, 'handleSubmit'> { }

export const EditScopeProfileForm = ({ register }: EditScopeProfileFormProps) => (
    <VStack width="full" gap={3}>
        <FormControl>
            <FormLabel>Team Name</FormLabel>
            <Input type='text' {...register('name')} />
            <FormHelperText>e.g. Pink Fluffy Kittens</FormHelperText>
        </FormControl>
        <FormControl>
            <FormLabel>Mission</FormLabel>
            <Textarea {...register('description')} />
            <FormHelperText>e.g. to save each stray kitten in the world</FormHelperText>
        </FormControl>
    </VStack>
);