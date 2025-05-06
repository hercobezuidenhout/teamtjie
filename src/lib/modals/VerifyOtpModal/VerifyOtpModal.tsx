'use client'

import { LoadingButton } from "@/lib/buttons/LoadingButton/LoadingButton"
import { Box, Button, HStack, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, PinInput, PinInputField, Text, VStack } from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"

interface VerifyOtpModalProps {
    isOpen: boolean
    onClose: (verified?: boolean, error?: string) => void
    email: string
}

export const VerifyOtpModal = ({ isOpen, onClose, email }: VerifyOtpModalProps) => {
    const supabase = useSupabaseClient()
    const [otp, setOtp] = useState<string>('')
    const [verifying, setVerifying] = useState(false)

    const verifyOtp = async (otpToVerify?: string) => {
        setVerifying(true)

        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: otpToVerify ? otpToVerify : otp,
            type: 'email_change'
        })

        if (error) {
            setVerifying(false)
            onClose(false, error.message)
            return
        }

        console.info("VerifyOtpModal", data)

        setVerifying(false)
        onClose(true)
    }

    const handleOtpChange = (value) => {
        setOtp(value)

        if (value.length === 6) {
            verifyOtp(value)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size={{ base: 'full', md: 'lg' }}>
            <ModalOverlay />
            <ModalContent backgroundColor="chakra-card-bg">
                <ModalBody justifyContent="space-around">
                    <VStack justifyContent="space-around" alignItems="stretch">
                        <VStack alignItems="stretch" gap={5} textAlign="center" height="fit-content">
                            <Heading size="md">Verify Email</Heading>
                            <Text>An OTP has been sent to {email}.</Text>
                            <HStack width="fit-content" margin="auto">
                                <PinInput value={otp} onChange={handleOtpChange}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter justifyContent="space-around">
                    <HStack gap={4} flexDirection={{ base: 'column', md: 'row' }} width={{ base: 'full', md: 'fit-content' }} alignItems={{ base: 'flex-start', md: 'flex-end' }}>
                        <Button onClick={() => onClose()} width={{ base: 'full', md: 'fit-content' }}>Cancel</Button>
                        <LoadingButton disabled={verifying} isLoading={verifying} onClick={verifyOtp} size="md" variant="primary" width={{ base: 'full', md: 'fit-content' }}>Continue</LoadingButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}