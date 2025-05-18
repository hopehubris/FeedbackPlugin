'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  Text,
  useToast,
  Divider,
  Heading,
  useColorModeValue,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/DashboardLayout'

interface Settings {
  widgetPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  widgetColor: string
  autoShowWidget: boolean
  autoShowDelay: number
  enableEmailNotifications: boolean
  notificationEmail: string
  enableAnalytics: boolean
  retentionPeriod: number
  maxFeedbackLength: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    widgetPosition: 'bottom-right',
    widgetColor: '#4A5568',
    autoShowWidget: false,
    autoShowDelay: 30,
    enableEmailNotifications: false,
    notificationEmail: '',
    enableAnalytics: true,
    retentionPeriod: 90,
    maxFeedbackLength: 1000,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch settings',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Text>Loading settings...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box maxW="4xl" mx="auto">
        <form onSubmit={handleSubmit}>
          <VStack spacing={8} align="stretch">
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Heading size="md" mb={6}>
                Widget Settings
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Widget Position</FormLabel>
                  <Select
                    value={settings.widgetPosition}
                    onChange={(e) =>
                      handleChange('widgetPosition', e.target.value)
                    }
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Widget Color</FormLabel>
                  <Input
                    type="color"
                    value={settings.widgetColor}
                    onChange={(e) =>
                      handleChange('widgetColor', e.target.value)
                    }
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Auto Show Widget</FormLabel>
                  <Switch
                    isChecked={settings.autoShowWidget}
                    onChange={(e) =>
                      handleChange('autoShowWidget', e.target.checked)
                    }
                  />
                </FormControl>

                {settings.autoShowWidget && (
                  <FormControl>
                    <FormLabel>Auto Show Delay (seconds)</FormLabel>
                    <NumberInput
                      value={settings.autoShowDelay}
                      onChange={(_, value) =>
                        handleChange('autoShowDelay', value)
                      }
                      min={5}
                      max={300}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
              </VStack>
            </Box>

            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Heading size="md" mb={6}>
                Notification Settings
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Enable Email Notifications</FormLabel>
                  <Switch
                    isChecked={settings.enableEmailNotifications}
                    onChange={(e) =>
                      handleChange('enableEmailNotifications', e.target.checked)
                    }
                  />
                </FormControl>

                {settings.enableEmailNotifications && (
                  <FormControl>
                    <FormLabel>Notification Email</FormLabel>
                    <Input
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) =>
                        handleChange('notificationEmail', e.target.value)
                      }
                    />
                  </FormControl>
                )}
              </VStack>
            </Box>

            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Heading size="md" mb={6}>
                Data Settings
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Enable Analytics</FormLabel>
                  <Switch
                    isChecked={settings.enableAnalytics}
                    onChange={(e) =>
                      handleChange('enableAnalytics', e.target.checked)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Data Retention Period (days)</FormLabel>
                  <NumberInput
                    value={settings.retentionPeriod}
                    onChange={(_, value) =>
                      handleChange('retentionPeriod', value)
                    }
                    min={30}
                    max={365}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Maximum Feedback Length</FormLabel>
                  <NumberInput
                    value={settings.maxFeedbackLength}
                    onChange={(_, value) =>
                      handleChange('maxFeedbackLength', value)
                    }
                    min={100}
                    max={5000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Settings
            </Button>
          </VStack>
        </form>
      </Box>
    </DashboardLayout>
  )
} 