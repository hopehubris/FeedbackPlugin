'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Code,
  Heading,
} from '@chakra-ui/react'

export default function WidgetPage() {
  const [appName, setAppName] = useState('')
  const [domain, setDomain] = useState('')
  const [appId, setAppId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: appName, domain }),
      })

      if (!response.ok) {
        throw new Error('Failed to register app')
      }

      const data = await response.json()
      setAppId(data.id)

      toast({
        title: 'App registered successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register app. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const widgetCode = appId
    ? `<script>
  (function(w,d,s,o,f,js,fjs){
    w['FeedbackLoop']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id='feedback-loop-widget';js.src='${process.env.NEXT_PUBLIC_WIDGET_URL}/widget.js';
    js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','feedbackLoop'));
  feedbackLoop('init', { appId: '${appId}' });
</script>`
    : ''

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="stretch">
        <Heading>Get Your Widget</Heading>
        
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>App Name</FormLabel>
              <Input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Enter your app name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Domain</FormLabel>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., app.example.com"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Registering"
            >
              Register App
            </Button>
          </VStack>
        </Box>

        {appId && (
          <Box>
            <Text mb={4}>Add this code to your website:</Text>
            <Code p={4} borderRadius="md" whiteSpace="pre" display="block">
              {widgetCode}
            </Code>
          </Box>
        )}
      </VStack>
    </Container>
  )
} 