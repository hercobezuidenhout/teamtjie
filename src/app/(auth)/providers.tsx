'use client'

import { PropsWithChildren } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export const AuthProviders = ({ children }: PropsWithChildren) => {

  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}