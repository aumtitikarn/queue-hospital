import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Department {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentData {
  name: string
  description?: string
}

export interface UpdateDepartmentData {
  name: string
  description?: string
}

// Fetch all departments
export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await fetch('/api/departments')
      if (!res.ok) throw new Error('Failed to fetch departments')
      return res.json()
    },
  })
}

// Fetch single department
export function useDepartment(id: string) {
  return useQuery<Department>({
    queryKey: ['departments', id],
    queryFn: async () => {
      const res = await fetch(`/api/departments/${id}`)
      if (!res.ok) throw new Error('Failed to fetch department')
      return res.json()
    },
    enabled: !!id,
  })
}

// Create department
export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDepartmentData) => {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create department')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}

// Update department
export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDepartmentData }) => {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update department')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] })
    },
  })
}

// Delete department
export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete department')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}

