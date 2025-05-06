import { PropsWithChildren } from 'react'
import { MarketingProviders } from './providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teamtjie',
  description: 'Helping you understand your team better',
}


const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <MarketingProviders>
      {children}
    </MarketingProviders>
  )
}

export default MarketingLayout
