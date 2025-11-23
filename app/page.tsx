'use client'

import { useDepartments } from '@/hooks/useDepartments'
import { useQueue, useCreateQueue } from '@/hooks/useQueue'
import Link from 'next/link'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QueuePage() {
  const { data: departments, isLoading: departmentsLoading } = useDepartments()
  const createQueue = useCreateQueue()
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    departmentId: '',
  })
  const [createdQueueId, setCreatedQueueId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: queueTicket } = useQueue(createdQueueId || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createQueue.mutateAsync({
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber || undefined,
        departmentId: formData.departmentId,
      })
      setCreatedQueueId(result.id)
      setFormData({
        patientName: '',
        phoneNumber: '',
        departmentId: '',
      })
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการกดบัตรคิว')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewQueue = () => {
    setCreatedQueueId(null)
  }

  if (queueTicket && createdQueueId) {
    const statusUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/${createdQueueId}/status`
      : ''

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">

          {/* สลิปคิว */}
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-2xl border-2 border-dashed border-gray-300">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
              <div className="text-4xl mb-2">🏥</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                ระบบคิวโรงพยาบาล
              </h1>
              <p className="text-gray-600 text-sm">บัตรคิว</p>
            </div>

            {/* ข้อมูลคิว */}
            <div className="mb-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">แผนก</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {queueTicket.department.name}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">หมายเลขคิว</div>
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
                  {queueTicket.queueNumber}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">ชื่อผู้ป่วย</div>
                <div className="text-lg font-semibold text-gray-900">
                  {queueTicket.patientName}
                </div>
              </div>

              {queueTicket.phoneNumber && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">เบอร์โทรศัพท์</div>
                  <div className="text-base text-gray-700">
                    {queueTicket.phoneNumber}
                  </div>
                </div>
              )}

              <div className="text-center text-xs text-gray-500 mt-4">
                {new Date(queueTicket.createdAt).toLocaleString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* QR Code */}
            {statusUrl && (
              <div className="mb-6 pt-6 border-t-2 border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    สแกน QR Code เพื่อดูสถานะคิว
                  </p>
                  <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-gray-200 inline-block">
                    <QRCodeSVG
                      value={statusUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    สแกนเพื่อดูจำนวนคิวที่เหลือและเวลารอโดยประมาณ
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t-2 border-gray-200">
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 mb-4">
                <p className="text-xs text-yellow-800 text-center">
                  ⚠️ กรุณารอเรียกคิวที่หน้าจอแสดงคิว หรือสแกน QR Code เพื่อดูสถานะ
                </p>
              </div>
              <button
                onClick={handleNewQueue}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                กดบัตรคิวใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            กดบัตรคิว
          </h1>
          <p className="mb-8 text-gray-600">
            กรุณากรอกข้อมูลเพื่อรับบัตรคิว
          </p>

          {departmentsLoading ? (
            <div className="text-center py-8 text-gray-600">
              กำลังโหลดแผนก...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="departmentId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  แผนก <span className="text-red-500">*</span>
                </label>
                <select
                  id="departmentId"
                  required
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value })
                  }
                  disabled={!departments || departments.length === 0}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!departments || departments.length === 0 
                      ? 'ยังไม่มีแผนก' 
                      : 'เลือกแผนก'}
                  </option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="patientName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ชื่อผู้ป่วย <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  required
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="08X-XXX-XXXX (ไม่บังคับ)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'กำลังกดบัตรคิว...' : 'กดบัตรคิว'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

