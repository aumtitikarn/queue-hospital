import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface QueueTicket {
  id: string
  queueNumber: number
  patientName: string
  phoneNumber: string | null
  departmentId: string
  status: 'waiting' | 'serving' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  department: {
    id: string
    name: string
    description: string | null
  }
}

export interface CreateQueueData {
  patientName: string
  phoneNumber?: string
  departmentId: string
}

// Fetch all queue tickets
export function useQueues(departmentId?: string, status?: string) {
  return useQuery<QueueTicket[]>({
    queryKey: ['queues', departmentId, status],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (departmentId) params.append('departmentId', departmentId)
      if (status) params.append('status', status)
      const res = await fetch(`/api/queue?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch queues')
      return res.json()
    },
  })
}

// Fetch single queue ticket
export function useQueue(id: string) {
  return useQuery<QueueTicket>({
    queryKey: ['queues', id],
    queryFn: async () => {
      const res = await fetch(`/api/queue/${id}`)
      if (!res.ok) throw new Error('Failed to fetch queue ticket')
      return res.json()
    },
    enabled: !!id,
  })
}

// Create queue ticket
export function useCreateQueue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateQueueData) => {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create queue ticket')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] })
    },
  })
}

// Update queue ticket status
export function useUpdateQueueStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: QueueTicket['status'] }) => {
      const res = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update queue ticket')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['queues'] })
      queryClient.invalidateQueries({ queryKey: ['queues', variables.id] })
    },
  })
}

