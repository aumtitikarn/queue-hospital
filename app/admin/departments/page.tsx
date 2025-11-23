'use client'

import { useDepartments, useDeleteDepartment } from '@/hooks/useDepartments'
import Link from 'next/link'
import { useState } from 'react'

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments()
  const deleteDepartment = useDeleteDepartment()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแผนกนี้?')) return

    setDeletingId(id)
    try {
      await deleteDepartment.mutateAsync(id)
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบแผนก')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">กำลังโหลด...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              จัดการแผนก
            </h1>
            <p className="mt-2 text-gray-600 text-lg">เพิ่ม แก้ไข และลบข้อมูลแผนก</p>
          </div>
          <Link
            href="/admin/departments/new"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 text-white hover:from-blue-700 hover:to-cyan-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            + เพิ่มแผนกใหม่
          </Link>
        </div>

        {departments && departments.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg border-2 border-dashed border-blue-200">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-gray-600 mb-6 text-lg">ยังไม่มีแผนก</p>
            <Link
              href="/admin/departments/new"
              className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-white hover:from-blue-700 hover:to-cyan-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              + เพิ่มแผนกแรก
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments?.map((dept) => (
              <div
                key={dept.id}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    🏥
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {dept.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/admin/departments/${dept.id}/edit`}
                    className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    ✏️ แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    disabled={deletingId === dept.id}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === dept.id ? '⏳ กำลังลบ...' : '🗑️ ลบ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

