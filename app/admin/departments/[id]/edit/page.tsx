'use client'

import { useDepartment, useUpdateDepartment } from '@/hooks/useDepartments'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EditDepartmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: department, isLoading } = useDepartment(id)
  const updateDepartment = useUpdateDepartment()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || '',
      })
    }
  }, [department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateDepartment.mutateAsync({
        id,
        data: {
          name: formData.name,
          description: formData.description || undefined,
        },
      })
      router.push('/admin/departments')
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตแผนก')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">กำลังโหลด...</div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">ไม่พบแผนก</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/departments"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← กลับไปยังรายการแผนก
          </Link>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
              ✏️
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              แก้ไขแผนก
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ชื่อแผนก <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="เช่น แผนกอายุรกรรม"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                คำอธิบาย
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับแผนก"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
              </button>
              <Link
                href="/admin/departments"
                className="flex-1 rounded-lg border-2 border-blue-200 bg-white px-4 py-3 text-center text-blue-700 hover:bg-blue-50 font-medium transition-colors"
              >
                ยกเลิก
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

