'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/DashboardLayout'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

interface DashboardStats {
  totalFeedback: number
  averageRating: number
  activeApps: number
  responseRate: number
  ratingTrend: Array<{ date: string; rating: number }>
  feedbackByApp: Array<{ name: string; count: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cardBg = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading || !stats) {
    return (
      <DashboardLayout>
        <Text>Loading dashboard data...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box maxW="7xl" mx="auto">
        <Heading mb={8}>Dashboard Overview</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Stat
            px={4}
            py={5}
            bg={cardBg}
            shadow="base"
            rounded="lg"
          >
            <StatLabel>Total Feedback</StatLabel>
            <StatNumber>{stats.totalFeedback}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            shadow="base"
            rounded="lg"
          >
            <StatLabel>Average Rating</StatLabel>
            <StatNumber>{stats.averageRating.toFixed(1)}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              9.05%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            shadow="base"
            rounded="lg"
          >
            <StatLabel>Active Apps</StatLabel>
            <StatNumber>{stats.activeApps}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              14.05%
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            shadow="base"
            rounded="lg"
          >
            <StatLabel>Response Rate</StatLabel>
            <StatNumber>{stats.responseRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              5.05%
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box
            bg={cardBg}
            p={6}
            rounded="lg"
            shadow="base"
            h="400px"
          >
            <Heading size="md" mb={4}>Rating Trend</Heading>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box
            bg={cardBg}
            p={6}
            rounded="lg"
            shadow="base"
            h="400px"
          >
            <Heading size="md" mb={4}>Feedback by App</Heading>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.feedbackByApp}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  )
} 