'use client';

import { Modal, ModalContent, ModalOverlay, ModalProps, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Button, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PostContent } from "./PostContent";
import { ChangeScopeContent } from "./ChangeScopeContent";
import { Scope } from "@prisma/client";
import { CreatePostDto } from "@/models";
import { useCreatePostMutation } from "@/services/feed/mutations/use-create-post-mutation";
import { useValidatePostMutation } from "@/services/feed/mutations/use-validate-post-mutation";

interface PostModalProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
    initialScope: Scope;
    isOpen: boolean;
    onClose: () => void;
    initialPostType: 'WIN' | 'FINE' | 'PAYMENT';
}

export const PostModal = ({ isOpen, onClose, initialPostType, initialScope }: PostModalProps) => {
    const [postType, setPostType] = useState(initialPostType);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedScope, setSelectedScope] = useState<Scope>(initialScope);
    const [description, setDescription] = useState('');
    const { mutateAsync: createPost, isPending: isCreating } = useCreatePostMutation();
    const { mutateAsync: validatePost } = useValidatePostMutation();
    const [changeScope, setChangeScope] = useState(false);
    const { isOpen: isValidationModalOpen, onOpen: openValidationModal, onClose: closeValidationModal } = useDisclosure();

    const handleScopeChange = (scope: Scope | undefined) => {
        if (scope) {
            setSelectedScope(scope);
            setChangeScope(false);
        }
    };

    const submitForReal = async () => {

        closeValidationModal();

        const post: CreatePostDto = {
            description: description,
            scopeId: selectedScope.id,
            type: postType,
            issuedToId: selectedUser ? selectedUser : undefined,
            valueIds: []
        };

        await createPost(post);

        onClose();
    };

    const submitPost = async () => {


        const containsOffensiveLanguage = await validatePost({ description: description });
        if (containsOffensiveLanguage) {
            openValidationModal();

        } else {
            submitForReal();
        }

    };

    useEffect(() => {
        setPostType(initialPostType);
        return () => {
            setPostType(initialPostType);
            setChangeScope(false);
            setSelectedScope(initialScope);
            setSelectedUser('');
            setDescription('');
        };
    }, [initialPostType]);


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
                <ModalOverlay />
                <ModalContent backgroundColor="chakra-card-bg">
                    {!changeScope && (
                        <>
                            <PostContent
                                onClose={onClose}
                                postType={postType}
                                selectedUser={selectedUser}
                                onSelectedUserChange={setSelectedUser}
                                onPostTypeChange={setPostType}
                                selectedScope={selectedScope}
                                onChangeScope={() => setChangeScope(true)}
                                onSubmit={submitPost}
                                description={description}
                                setDescription={setDescription}
                                isLoading={isCreating}
                            />

                        </>
                    )}
                    {changeScope && (
                        <ChangeScopeContent onScopeChange={handleScopeChange} selectedScope={selectedScope} />
                    )}
                </ModalContent>
            </Modal>

            <Modal size="xs" isOpen={isValidationModalOpen} onClose={closeValidationModal}>
                <ModalOverlay />
                <ModalContent backgroundColor="chakra-card-bg">
                    <ModalHeader>Offensive Content Warning</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody minH="fit-content">
                        <Text>Your post might contain language that can be seen as offensive. Are you sure you want to post this?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeValidationModal}>
                            Close
                        </Button>
                        <Button variant="primary" ml="3" onClick={submitForReal}>
                            Post Anyway
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
