import Link from 'next/link'
import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="center" textAlign="center">
        <Heading as="h1" size="2xl" bgGradient="linear(to-r, primary.400, primary.600)" bgClip="text">
          Feedback Loop
        </Heading>
        <Text fontSize="xl" color="gray.600" maxW="2xl">
          A lightweight, embeddable JavaScript-based tool for collecting real-time user feedback within enterprise web applications.
        </Text>
        <VStack spacing={4}>
          <Link href="/admin" passHref>
            <Button colorScheme="blue" size="lg">
              Admin Console
            </Button>
          </Link>
          <Link href="/widget" passHref>
            <Button variant="outline" colorScheme="blue" size="lg">
              Get Widget
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Container>
  )
} 