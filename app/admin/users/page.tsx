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
  useToast,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { FiMoreVertical, FiUser, FiUserX } from 'react-icons/fi'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  lastLogin: string | null
  status: 'active' | 'inactive'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  })
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.700')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const queryParams = new URLSearchParams(filters)
        const response = await fetch(`/api/admin/users?${queryParams}`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [filters, toast])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      )

      toast({
        title: 'Success',
        description: `User status updated to ${newStatus}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Text>Loading users...</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box maxW="7xl" mx="auto">
        <HStack spacing={4} mb={6}>
          <Input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            maxW="300px"
          />
          <Select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            maxW="200px"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            maxW="200px"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </HStack>

        <Box bg={bgColor} shadow="base" rounded="lg" overflow="hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last Login</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack>
                      <FiUser />
                      <Text>{user.name || 'N/A'}</Text>
                    </HStack>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={user.role === 'admin' ? 'purple' : 'blue'}
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.status === 'active' ? 'green' : 'red'}
                    >
                      {user.status}
                    </Badge>
                  </Td>
                  <Td>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'}
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
                        <MenuItem
                          icon={<FiUser />}
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status === 'active' ? 'inactive' : 'active'
                            )
                          }
                        >
                          {user.status === 'active'
                            ? 'Deactivate User'
                            : 'Activate User'}
                        </MenuItem>
                        <MenuItem icon={<FiUserX />} color="red.500">
                          Delete User
                        </MenuItem>
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