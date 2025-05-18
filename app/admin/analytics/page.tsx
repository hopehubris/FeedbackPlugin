'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Select,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { DashboardLayout } from '@/components/DashboardLayout'

interface AnalyticsData {
  totalFeedback: number
  averageRating: number
  responseRate: number
  ratingDistribution: Array<{
    rating: number
    count: number
  }>
  feedbackTrend: Array<{
    date: string
    count: number
    averageRating: number
  }>
  topPages: Array<{
    pageUrl: string
    count: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const bgColor = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <Text>Loading analytics data...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box maxW="7xl" mx="auto">
        <HStack mb={6} justify="flex-end">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            maxW="200px"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
        </HStack>

        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
          <GridItem>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Stat>
                <StatLabel>Total Feedback</StatLabel>
                <StatNumber>{data.totalFeedback}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Stat>
                <StatLabel>Average Rating</StatLabel>
                <StatNumber>{data.averageRating.toFixed(1)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  0.5
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Stat>
                <StatLabel>Response Rate</StatLabel>
                <StatNumber>{data.responseRate}%</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5%
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Text mb={4} fontSize="lg" fontWeight="medium">
                Feedback Trend
              </Text>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.feedbackTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      name="Feedback Count"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageRating"
                      stroke="#82ca9d"
                      name="Average Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>

          <GridItem>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Text mb={4} fontSize="lg" fontWeight="medium">
                Rating Distribution
              </Text>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.ratingDistribution}
                      dataKey="count"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.ratingDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={2}>
            <Box bg={bgColor} p={6} rounded="lg" shadow="base">
              <Text mb={4} fontSize="lg" fontWeight="medium">
                Top Pages
              </Text>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pageUrl" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </DashboardLayout>
  )
} 