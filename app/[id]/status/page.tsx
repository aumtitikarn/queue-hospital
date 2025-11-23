'use client'

import { useQueue } from '@/hooks/useQueue'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function QueueStatusPage() {
  const params = useParams()
  const id = params.id as string

  const { data: status, isLoading } = useQuery({
    queryKey: ['queue-status', id],
    queryFn: async () => {
      const res = await fetch(`/api/queue/${id}/status`)
      if (!res.ok) throw new Error('Failed to fetch queue status')
      return res.json()
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">กำลังโหลด...</div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-lg text-gray-600">ไม่พบข้อมูลคิว</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  const { queueTicket, queuesBefore, currentServing, estimatedWait } = status

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-blue-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              สถานะคิวของคุณ
            </h1>
            <p className="text-gray-600">{queueTicket.department.name}</p>
          </div>

          <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-2 border-blue-200">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">หมายเลขคิวของคุณ</div>
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
                {queueTicket.queueNumber}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {queueTicket.patientName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200 text-center">
              <div className="text-2xl mb-2">⏳</div>
              <div className="text-sm text-gray-600 mb-1">คิวที่เหลือ</div>
              <div className="text-3xl font-bold text-green-600">
                {queuesBefore}
              </div>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 border border-orange-200 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <div className="text-sm text-gray-600 mb-1">เวลารอโดยประมาณ</div>
              <div className="text-2xl font-bold text-orange-600">
                {estimatedWait} นาที
              </div>
            </div>
          </div>

          {currentServing && (
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">คิวที่กำลังให้บริการ</div>
                <div className="text-3xl font-bold text-blue-600">
                  {currentServing}
                </div>
                {queueTicket.queueNumber === currentServing && (
                  <div className="mt-2 text-sm font-semibold text-green-600">
                    ⭐ ถึงคิวของคุณแล้ว!
                  </div>
                )}
              </div>
            </div>
          )}

          {queuesBefore === 0 && queueTicket.status === 'waiting' && (
            <div className="rounded-lg bg-green-50 p-4 border-2 border-green-300 mb-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-lg font-bold text-green-700">
                  ถึงคิวของคุณแล้ว!
                </div>
                <div className="text-sm text-green-600 mt-1">
                  กรุณาไปที่แผนกเพื่อรับบริการ
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 mb-6">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ กรุณารอเรียกคิวที่หน้าจอแสดงคิว
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

