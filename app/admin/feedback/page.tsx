'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { FiMoreVertical, FiStar } from 'react-icons/fi'

interface Feedback {
  id: string
  rating: number
  comment: string | null
  pageUrl: string
  userEmail: string | null
  createdAt: string
  app: {
    name: string
  }
  responses: Array<{
    id: string
    content: string
    createdAt: string
  }>
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    rating: '',
    app: '',
    search: '',
    dateRange: '7d',
  })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const bgColor = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const queryParams = new URLSearchParams({
          ...filters,
          sortBy,
          sortOrder,
        })
        const response = await fetch(`/api/admin/feedback?${queryParams}`)
        const data = await response.json()
        setFeedback(data)
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [filters, sortBy, sortOrder])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'green'
    if (rating >= 3) return 'yellow'
    return 'red'
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Text>Loading feedback data...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box maxW="7xl" mx="auto">
        <HStack spacing={4} mb={6}>
          <Input
            placeholder="Search feedback..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            maxW="300px"
          />
          <Select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            maxW="200px"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </Select>
          <Select
            value={filters.app}
            onChange={(e) => handleFilterChange('app', e.target.value)}
            maxW="200px"
          >
            <option value="">All Apps</option>
            {/* Add app options dynamically */}
          </Select>
          <Select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            maxW="200px"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
        </HStack>

        <Box bg={bgColor} shadow="base" rounded="lg" overflow="hidden">
          <Table>
            <Thead>
              <Tr>
                <Th cursor="pointer" onClick={() => handleSort('rating')}>
                  Rating
                </Th>
                <Th>Comment</Th>
                <Th cursor="pointer" onClick={() => handleSort('app')}>
                  App
                </Th>
                <Th>Page</Th>
                <Th cursor="pointer" onClick={() => handleSort('createdAt')}>
                  Date
                </Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {feedback.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <Badge colorScheme={getRatingColor(item.rating)}>
                      {item.rating} <FiStar style={{ display: 'inline' }} />
                    </Badge>
                  </Td>
                  <Td maxW="300px" isTruncated>
                    {item.comment || '-'}
                  </Td>
                  <Td>{item.app.name}</Td>
                  <Td maxW="200px" isTruncated>
                    {item.pageUrl}
                  </Td>
                  <Td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem>View Details</MenuItem>
                        <MenuItem>Add Response</MenuItem>
                        <MenuItem>Export</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </DashboardLayout>
  )
} 