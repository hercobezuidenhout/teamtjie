import { Button, ModalBody, ModalFooter, VStack } from "@chakra-ui/react";
import { PostModalHeader } from "./PostModalHeader";
import { PostTypeRadio } from "@/lib/inputs/PostTypeRadio/PostTypeRadio";
import { UserAutoComplete } from "@/lib/inputs/UserAutoComplete/UserAutoComplete";
import { PostDescription, PostDescriptionProps } from "./PostDescription";
import { Scope } from "@prisma/client";

interface PostContentProps extends PostDescriptionProps {
    postType: 'WIN' | 'FINE' | 'PAYMENT';
    selectedUser: string;
    onPostTypeChange: (newType) => void;
    onSelectedUserChange: (newUser) => void;
    onClose: () => void;
    selectedScope: Scope;
    onChangeScope: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export const PostContent = ({ postType, selectedUser, onPostTypeChange, onSelectedUserChange, onClose, selectedScope, onChangeScope, onSubmit, isLoading, ...rest }: PostContentProps) => {
    return (
        <>
            <PostModalHeader scope={selectedScope} onChangeScope={onChangeScope} />
            <ModalBody>
                <VStack alignItems="stretch" width="full" gap={5} height="fit-content">
                    <PostTypeRadio initialValue={postType} onChange={onPostTypeChange} scopeId={selectedScope.id} />
                    {postType !== 'PAYMENT' && (
                        <UserAutoComplete
                            onChange={(user) => onSelectedUserChange(String(user))}
                            scopeId={selectedScope.id}
                            scopeType={selectedScope.type}
                            value={[selectedUser]}
                        />
                    )}
                    <PostDescription {...rest} />
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