'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  Avatar,
  Badge,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import {
  FiHeart,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiTarget,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';

const MarketingPage = () => {
  const bgGradient = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box w="full">
      {/* Hero Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={8} textAlign="center" maxW="4xl" mx="auto">
          <Badge
            colorScheme="blue"
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            textTransform="none"
          >
            Build Better Team Cultures
          </Badge>
          <Heading
            as="h1"
            size={{ base: 'xl', md: '2xl', lg: '3xl' }}
            fontWeight="bold"
            lineHeight="shorter"
          >
            Transform Your Team Culture with{' '}
            <Text
              as="span"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Teamtjie
            </Text>
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="2xl"
          >
            The all-in-one platform for building engaged, high-performing
            teams. Track sentiment, celebrate wins, and foster meaningful
            connections.
          </Text>
          <HStack spacing={4} pt={4}>
            <Button
              as={Link}
              href="/login"
              size="lg"
              colorScheme="blue"
              borderRadius="full"
              px={8}
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Get Started Free
            </Button>
            <Button
              as={Link}
              href="#features"
              size="lg"
              variant="outline"
              borderRadius="full"
              px={8}
            >
              Learn More
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }} id="features">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="xl">Everything You Need to Build Culture</Heading>
            <Text fontSize="lg" color="gray.600">
              Powerful features designed to help your team thrive
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {/* Feature 1 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="blue.50"
                    borderRadius="xl"
                    color="blue.500"
                  >
                    <Icon as={FiHeart} boxSize={6} />
                  </Box>
                  <Heading size="md">Daily Sentiment Tracking</Heading>
                  <Text color="gray.600">
                    Understand how your team feels every day. Track mood
                    trends and identify issues before they become problems.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Feature 2 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="blue.50"
                    borderRadius="xl"
                    color="blue.500"
                  >
                    <Icon as={FiCheckCircle} boxSize={6} />
                  </Box>
                  <Heading size="md">Team Health Checks</Heading>
                  <Text color="gray.600">
                    Regular pulse checks to measure team health across key
                    dimensions. Get actionable insights to improve.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Feature 3 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="green.50"
                    borderRadius="xl"
                    color="green.500"
                  >
                    <Icon as={FiStar} boxSize={6} />
                  </Box>
                  <Heading size="md">Celebrate Wins</Heading>
                  <Text color="gray.600">
                    Share achievements, recognize contributions, and build a
                    culture of appreciation with team-wide celebrations.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Feature 4 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="purple.50"
                    borderRadius="xl"
                    color="purple.500"
                  >
                    <Icon as={FiTarget} boxSize={6} />
                  </Box>
                  <Heading size="md">Values & Mission</Heading>
                  <Text color="gray.600">
                    Define and track team values. Keep everyone aligned with
                    your mission and core principles.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Feature 5 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="orange.50"
                    borderRadius="xl"
                    color="orange.500"
                  >
                    <Icon as={FiTrendingUp} boxSize={6} />
                  </Box>
                  <Heading size="md">Insights & Analytics</Heading>
                  <Text color="gray.600">
                    Data-driven insights into team engagement, sentiment
                    trends, and participation metrics.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Feature 6 */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-4px)' }}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Box
                    p={3}
                    bg="teal.50"
                    borderRadius="xl"
                    color="teal.500"
                  >
                    <Icon as={FiUsers} boxSize={6} />
                  </Box>
                  <Heading size="md">Team Collaboration</Heading>
                  <Text color="gray.600">
                    Foster connections with team feeds, reactions, and
                    meaningful interactions that build trust.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* How It Works */}
      <Box bg={bgGradient} py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Heading size="xl">Simple to Get Started</Heading>
              <Text fontSize="lg" color="gray.600">
                Build a thriving team culture in three easy steps
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <VStack spacing={4} textAlign="center">
                <Flex
                  w={16}
                  h={16}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  1
                </Flex>
                <Heading size="md">Create Your Space</Heading>
                <Text color="gray.600">
                  Set up your team workspace in minutes. Invite members and
                  define your values.
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center">
                <Flex
                  w={16}
                  h={16}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  2
                </Flex>
                <Heading size="md">Engage Daily</Heading>
                <Text color="gray.600">
                  Team members share wins, track sentiment, and participate in
                  health checks.
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center">
                <Flex
                  w={16}
                  h={16}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  3
                </Flex>
                <Heading size="md">Watch Culture Grow</Heading>
                <Text color="gray.600">
                  Use insights to improve, celebrate progress, and build a
                  stronger team.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }} id="pricing">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="xl">Simple, Transparent Pricing</Heading>
            <Text fontSize="lg" color="gray.600">
              Start free, upgrade when you&apos;re ready for premium features
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            w="full"
            maxW="5xl"
            mx="auto"
          >
            {/* Free Plan */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <CardHeader>
                <VStack align="start" spacing={2}>
                  <Heading size="md">Free</Heading>
                  <Text color="gray.600">Perfect for getting started</Text>
                  <Heading size="2xl">R0</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Forever free
                  </Text>
                </VStack>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Team feed & posts</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Celebrate wins</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Team values</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Basic analytics</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Up to 10 members</Text>
                  </HStack>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  as={Link}
                  href="/login"
                  w="full"
                  variant="outline"
                  borderRadius="full"
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="lg"
              border="2px"
              borderColor="blue.500"
              position="relative"
            >
              <Badge
                position="absolute"
                top={-3}
                left="50%"
                transform="translateX(-50%)"
                colorScheme="blue"
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                Most Popular
              </Badge>
              <CardHeader>
                <VStack align="start" spacing={2}>
                  <Heading size="md">Teamtjie+</Heading>
                  <Text color="gray.600">For growing teams</Text>
                  <HStack align="baseline">
                    <Heading size="2xl">R99</Heading>
                    <Text color="gray.600">/month</Text>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">
                    Per team
                  </Text>
                </VStack>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text fontWeight="medium">Everything in Free</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Daily sentiment tracking</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Team health checks</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Advanced analytics</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Unlimited members</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Priority support</Text>
                  </HStack>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  as={Link}
                  href="/login"
                  w="full"
                  colorScheme="blue"
                  borderRadius="full"
                >
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <CardHeader>
                <VStack align="start" spacing={2}>
                  <Heading size="md">Premium</Heading>
                  <Text color="gray.600">For large organizations</Text>
                  <Heading size="2xl">Custom</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Contact us
                  </Text>
                </VStack>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text fontWeight="medium">Everything in Teamtjie+</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Multiple teams</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Custom integrations</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Dedicated support</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>SLA guarantee</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text>Custom training</Text>
                  </HStack>
                </VStack>
              </CardBody>
              <CardFooter>
                <Button
                  as={Link}
                  href="mailto:support@teamtjie.co.za"
                  w="full"
                  variant="outline"
                  borderRadius="full"
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Testimonials - Commented out until real testimonials are available */}
      {/* <Box bg={bgGradient} py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Heading size="xl">Loved by Teams Everywhere</Heading>
              <Text fontSize="lg" color="gray.600">
                See what our users have to say
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <Card
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color="yellow.400" fill="currentColor" />
                      ))}
                    </HStack>
                    <Text color="gray.600">
                      &quot;Teamtjie transformed how we connect as a remote team.
                      The daily sentiment tracking helps us stay in tune with
                      everyone&apos;s wellbeing.&quot;
                    </Text>
                    <HStack>
                      <Avatar name="Sarah Johnson" size="sm" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          Sarah Johnson
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Team Lead, TechCorp
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color="yellow.400" fill="currentColor" />
                      ))}
                    </HStack>
                    <Text color="gray.600">
                      &quot;The health checks feature is a game-changer. We can
                      identify and address team issues before they escalate.
                      Highly recommend!&quot;
                    </Text>
                    <HStack>
                      <Avatar name="Michael Chen" size="sm" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          Michael Chen
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Engineering Manager, StartupXYZ
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color="yellow.400" fill="currentColor" />
                      ))}
                    </HStack>
                    <Text color="gray.600">
                      &quot;Simple, effective, and actually fun to use. Our team
                      engagement has improved significantly since we started
                      using Teamtjie.&quot;
                    </Text>
                    <HStack>
                      <Avatar name="Emma Williams" size="sm" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          Emma Williams
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          HR Director, InnovateCo
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box> */}

      {/* Final CTA */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <Card
          bg="blue.500"
          color="white"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="xl"
        >
          <CardBody p={{ base: 8, md: 16 }}>
            <VStack spacing={6} textAlign="center">
              <Heading size="xl">Ready to Transform Your Team?</Heading>
              <Text fontSize="lg" maxW="2xl">
                Join hundreds of teams building better cultures with Teamtjie.
                Start free, no credit card required.
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  as={Link}
                  href="/login"
                  size="lg"
                  bg="white"
                  color="blue.500"
                  borderRadius="full"
                  px={8}
                  _hover={{ bg: 'gray.100' }}
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  Get Started Free
                </Button>
                <Button
                  as={Link}
                  href="mailto:support@teamtjie.co.za"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  borderRadius="full"
                  px={8}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Contact Sales
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        bg={useColorModeValue('gray.900', 'gray.950')}
        color="white"
        py={12}
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start" spacing={4}>
              <Heading size="md">Teamtjie</Heading>
              <Text color="gray.400" fontSize="sm">
                Building better team cultures, one connection at a time.
              </Text>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm">Product</Heading>
              <Link href="#features">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Features
                </Text>
              </Link>
              <Link href="#pricing">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Pricing
                </Text>
              </Link>
              <Link href="/login">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Login
                </Text>
              </Link>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm">Company</Heading>
              <Link href="mailto:support@teamtjie.co.za">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Contact
                </Text>
              </Link>
              <Link href="mailto:support@teamtjie.co.za">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Support
                </Text>
              </Link>
            </VStack>

            <VStack align="start" spacing={3}>
              <Heading size="sm">Legal</Heading>
              <Link href="#">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Privacy Policy
                </Text>
              </Link>
              <Link href="#">
                <Text color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
                  Terms of Service
                </Text>
              </Link>
            </VStack>
          </SimpleGrid>

          <Box
            mt={12}
            pt={8}
            borderTop="1px"
            borderColor="gray.800"
            textAlign="center"
          >
            <Text color="gray.400" fontSize="sm">
              © {new Date().getFullYear()} Teamtjie. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MarketingPage;
