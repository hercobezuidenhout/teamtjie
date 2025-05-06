'use client'

import { Card, CardBody, Heading, Text } from "@chakra-ui/react"

interface ScopeMissionProps {
    mission?: string
}

export const ScopeMission = ({ mission }: ScopeMissionProps) => {

    return mission && (
        <>
            <Heading size="md">Mission</Heading>
            <Card>
                <CardBody>
                    <Text whiteSpace="break-spaces">{mission}</Text>
                </CardBody>
            </Card>
        </>
    )
}