import { Button, ModalBody, ModalFooter, VStack, Text, Heading, Box, HStack, Wrap, WrapItem, Tag, TagLabel, TagCloseButton, SimpleGrid } from "@chakra-ui/react";
import { PostModalHeader } from "./PostModalHeader";
import { PostTypeRadio } from "@/lib/inputs/PostTypeRadio/PostTypeRadio";
import { UserAutoComplete } from "@/lib/inputs/UserAutoComplete/UserAutoComplete";
import { PostDescription, PostDescriptionProps } from "./PostDescription";
import { Scope, ScopeValue } from "@prisma/client";
import { ValueCard } from "@/lib/inputs/ValueCard/ValueCard";
import { useState } from "react";

interface PostContentProps extends PostDescriptionProps {
    postType: 'WIN';
    selectedUser: string;
    onPostTypeChange: (newType) => void;
    onSelectedUserChange: (newUser) => void;
    onClose: () => void;
    selectedScope: Scope;
    onChangeScope: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
    selectedValues: number[];
    onSelectedValuesChange: (values: number[]) => void;
    availableValues: ScopeValue[];
}

export const PostContent = ({ postType, selectedUser, onPostTypeChange, onSelectedUserChange, onClose, selectedScope, onChangeScope, onSubmit, isLoading, selectedValues, onSelectedValuesChange, availableValues, ...rest }: PostContentProps) => {
    const [isValuesExpanded, setIsValuesExpanded] = useState(false);

    const selectedValueObjects = availableValues.filter(v => selectedValues.includes(v.id));

    const handleRemoveValue = (valueId: number) => {
        onSelectedValuesChange(selectedValues.filter(id => id !== valueId));
    };

    const handleValueToggle = (valueId: number) => {
        const isSelected = selectedValues.includes(valueId);
        const newSelection = isSelected
            ? selectedValues.filter(id => id !== valueId)
            : [...selectedValues, valueId];

        onSelectedValuesChange(newSelection);
    };

    const toggleExpanded = () => {
        setIsValuesExpanded(!isValuesExpanded);
    };

    return (
        <>
            <PostModalHeader scope={selectedScope} onChangeScope={onChangeScope} />
            <ModalBody>
                <VStack alignItems="stretch" width="full" gap={5} height="fit-content">
                    <PostTypeRadio initialValue={postType} onChange={onPostTypeChange} scopeId={selectedScope.id} />
                    <UserAutoComplete
                        onChange={(user) => onSelectedUserChange(String(user))}
                        scopeId={selectedScope.id}
                        scopeType={selectedScope.type}
                        value={[selectedUser]}
                    />
                    <PostDescription {...rest} />
                    {availableValues.length > 0 && (
                        <VStack alignItems="stretch" width="full">
                            <Heading size="sm">VALUES</Heading>

                            {!isValuesExpanded ? (
                                <Box
                                    as="button"
                                    type="button"
                                    onClick={toggleExpanded}
                                    backgroundColor="chakra-body-bg"
                                    borderRadius="lg"
                                    borderColor="chakra-subtle-bg"
                                    borderWidth="1px"
                                    paddingX={{ base: 3, md: 4 }}
                                    paddingY={{ base: 2.5, md: 3 }}
                                    cursor="pointer"
                                    textAlign="left"
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: "chakra-primary-color",
                                    }}
                                >
                                    {selectedValues.length === 0 ? (
                                        <Text fontSize="sm" fontWeight="bold" color="chakra-placeholder-color">
                                            Select values...
                                        </Text>
                                    ) : (
                                        <Wrap spacing={2}>
                                            {selectedValueObjects.map((value, index) => (
                                                <WrapItem key={value.id}>
                                                    <Tag
                                                        size="md"
                                                        borderRadius="full"
                                                        bg="chakra-primary-color"
                                                        color="chakra-inverse-text"
                                                    >
                                                        <TagLabel>
                                                            <HStack spacing={2}>
                                                                <Box
                                                                    bg="whiteAlpha.300"
                                                                    borderRadius="full"
                                                                    px={2}
                                                                    py={0.5}
                                                                    minW="20px"
                                                                    textAlign="center"
                                                                >
                                                                    <Text fontSize="xs" fontWeight="bold" color="chakra-inverse-text">
                                                                        {index + 1}
                                                                    </Text>
                                                                </Box>
                                                                <Text fontSize="sm" color="chakra-inverse-text">{value.name}</Text>
                                                            </HStack>
                                                        </TagLabel>
                                                        <TagCloseButton
                                                            color="chakra-inverse-text"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveValue(value.id);
                                                            }}
                                                        />
                                                    </Tag>
                                                </WrapItem>
                                            ))}
                                        </Wrap>
                                    )}
                                </Box>
                            ) : (
                                <VStack alignItems="stretch" width="full" spacing={3}>
                                    <Box
                                        backgroundColor="chakra-body-bg"
                                        borderRadius="lg"
                                        borderColor="chakra-subtle-bg"
                                        borderWidth="1px"
                                        paddingX={{ base: 3, md: 4 }}
                                        paddingY={{ base: 3, md: 4 }}
                                        maxHeight={{ base: "300px", md: "400px" }}
                                        overflowY="auto"
                                    >
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                            {availableValues.map((value, index) => (
                                                <ValueCard
                                                    key={value.id}
                                                    index={index + 1}
                                                    isChecked={selectedValues.includes(value.id)}
                                                    onChange={() => handleValueToggle(value.id)}
                                                >
                                                    {value.name}
                                                </ValueCard>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                    <Button onClick={toggleExpanded} size="sm" variant="ghost" width="fit-content" alignSelf="flex-end">
                                        Done
                                    </Button>
                                </VStack>
                            )}

                            <Text fontSize="xs" color="chakra-subtle-text">Select values that align with this win (optional)</Text>
                        </VStack>
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button isLoading={isLoading} onClick={onSubmit} variant='primary' px={10} isDisabled={isLoading}>{!isLoading && 'Post'}</Button>
            </ModalFooter>
        </>
    );
};