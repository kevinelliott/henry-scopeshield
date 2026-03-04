'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Link from 'next/link'
import type { SOW } from '@/types'
import { getGradeColor } from '@/lib/intelligence'

export default function SOWDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [sow, setSow] = useState<SOW | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadSOW()
  }, [])

  async function loadSOW() {
    const { data } = await supabase.from('sows').select('*').eq('id', params.id).single()
    if (data) setSow(data as SOW)
    else router.push('/dashboard')
    setLoading(false)
  }

  async function deleteSOW() {
    if (!confirm('Are you sure you want to delete this SOW?')) return
    await supabase.from('sows').delete().eq('id', sow!.id)
    if (sow!.project_id) {
      await supabase.from('projects').delete().eq('id', sow!.project_id)
    }
    router.push('/dashboard')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  if (!sow) return null

  const scopeItems = (sow.scope_items || []) as { name: string; description: string }[]
  const exclusions = (sow.exclusions || []) as { name: string; description: string }[]
  const creepRisks = (sow.creep_risks || []) as { phrase: string; severity: string; suggestion: string; location: string }[]
  const missingSections = (sow.missing_sections || []) as string[]

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[var(--blue)]">← Back to Dashboard</Link>
            <h1 className="text-2xl font-bold text-[var(--navy)] mt-2">{sow.project_name}</h1>
            <p className="text-gray-500">{sow.client_name} · {sow.project_type?.replace('-', ' ')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: getGradeColor(sow.scope_grade || 'F') }}
            >
              {sow.scope_grade}
            </div>
            <div>
              <div className="text-xl font-bold">{sow.scope_score}/100</div>
              <div className="text-xs text-gray-500">Scope Score</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <Link href={`/sow/${sow.id}/document`} className="px-5 py-2 bg-[var(--blue)] text-white rounded-lg text-sm font-medium hover:bg-[var(--blue-dark)]">
            📄 View Document
          </Link>
          <Link href={`/sow/${sow.id}/change-order`} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            📝 Create Change Order
          </Link>
          <button onClick={deleteSOW} className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 ml-auto">
            Delete SOW
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-[var(--navy)]">${(sow.total_value || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-[var(--navy)]">{scopeItems.length}</div>
            <div className="text-xs text-gray-500">Scope Items</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-[var(--navy)]">{exclusions.length}</div>
            <div className="text-xs text-gray-500">Exclusions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-[var(--danger)]">{creepRisks.length}</div>
            <div className="text-xs text-gray-500">Risk Flags</div>
          </div>
        </div>

        {/* Creep Risks */}
        {creepRisks.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-[var(--navy)] mb-4">⚠️ Creep Risk Analysis</h2>
            <div className="space-y-3">
              {creepRisks.map((risk, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  risk.severity === 'high' ? 'border-red-200 bg-red-50' :
                  risk.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      risk.severity === 'high' ? 'bg-red-200 text-red-800' :
                      risk.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>{risk.severity}</span>
                    <span className="text-sm font-medium">&ldquo;{risk.phrase}&rdquo;</span>
                    <span className="text-xs text-gray-400">in {risk.location}</span>
                  </div>
                  <p className="text-sm text-gray-700">💡 {risk.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Sections */}
        {missingSections.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-[var(--navy)] mb-4">📋 Missing Sections</h2>
            <div className="grid grid-cols-2 gap-2">
              {missingSections.map(s => (
                <div key={s} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg text-sm">
                  <span className="text-orange-400">○</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scope Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-[var(--navy)] mb-4">✓ Scope Items</h2>
          <div className="space-y-2">
            {scopeItems.map((item, i) => (
              <div key={i} className="flex gap-3 p-2 border border-gray-100 rounded-lg">
                <span className="text-green-500">✓</span>
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        {exclusions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[var(--navy)] mb-4">✕ Exclusions</h2>
            <div className="space-y-2">
              {exclusions.map((ex, i) => (
                <div key={i} className="flex gap-3 p-2 bg-red-50 rounded-lg">
                  <span className="text-red-400">✕</span>
                  <div>
                    <div className="font-medium text-sm">{ex.name}</div>
                    <div className="text-xs text-gray-500">{ex.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
