'use client'

import { InvitationResponse } from '@/models'
import {
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useAcceptInvitationMutation } from '@/services/invitation/mutations/use-accept-invitation-mutation'
import { LoadingButton } from '@/lib/buttons/LoadingButton/LoadingButton'

interface InvitationDetailsProps {
  invitation: InvitationResponse
  label?: { id: number; type: string; name: string; href: string } | undefined
}
export const InvitationDetails = ({ invitation, label }: InvitationDetailsProps) => {
  const { mutateAsync: accept, isPending: isAcceptingInvitation } = useAcceptInvitationMutation()

  const session = useSession()
  const { push } = useRouter()

  const handleContinueClick = async () => {
    await accept(invitation.hash)

    if (label) {
      await push(label.href)
    }
  }

  const handleSignInClick = () => {
    push(`/login?returnTo=/join/${invitation.hash}`)
  }

  return (
    <VStack gap={4} textAlign="start" alignItems="start">
      <HStack w="fit-content">
        <Heading size="md">Teamtjie Invite</Heading>
      </HStack>
      <Text>
        You have been invited to join the {label?.type} {label?.name} as a{' '}
        {invitation?.defaultRole.toLowerCase()}!
      </Text>
      {session ? (
        <LoadingButton w="full" variant="primary" onClick={handleContinueClick} isLoading={isAcceptingInvitation}>
          Continue
        </LoadingButton>
      ) : (
        <Button w="full" variant="primary" onClick={handleSignInClick}>
          Sign In & Accept
        </Button>
      )}
    </VStack>
  )
}
