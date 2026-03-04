'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/ui/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SOW } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
}

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-500',
  B: 'bg-lime-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  F: 'bg-red-500',
}

export default function DashboardPage() {
  const [sows, setSows] = useState<SOW[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSOWs()
  }, [])

  async function loadSOWs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data } = await supabase
      .from('sows')
      .select('*')
      .order('created_at', { ascending: false })

    setSows((data as SOW[]) || [])
    setLoading(false)
  }

  async function duplicateSOW(sow: SOW) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { id, created_at, updated_at, ...sowData } = sow
    const { data } = await supabase.from('sows').insert({
      ...sowData,
      project_name: `${sow.project_name} (Copy)`,
      status: 'draft',
      user_id: user.id,
    }).select().single()

    if (data) {
      setSows(prev => [data as SOW, ...prev])
    }
  }

  async function updateStatus(sowId: string, status: string) {
    await supabase.from('sows').update({ status }).eq('id', sowId)
    setSows(prev => prev.map(s => s.id === sowId ? { ...s, status: status as SOW['status'] } : s))
  }

  const totalValue = sows.reduce((sum, s) => sum + (s.total_value || 0), 0)
  const avgScore = sows.length > 0 ? Math.round(sows.reduce((sum, s) => sum + (s.scope_score || 0), 0) / sows.length) : 0
  const highRiskCount = sows.filter(s => (s.creep_risks?.length || 0) > 3).length

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total SOWs</p>
            <p className="text-3xl font-bold text-[var(--navy)] mt-1">{sows.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-[var(--navy)] mt-1">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Avg. Scope Score</p>
            <p className="text-3xl font-bold text-[var(--navy)] mt-1">{avgScore}/100</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">High Creep Risk</p>
            <p className="text-3xl font-bold text-[var(--danger)] mt-1">{highRiskCount}</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--navy)]">Your SOWs</h1>
          <Link
            href="/sow/new"
            className="bg-[var(--blue)] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[var(--blue-dark)] transition-colors"
          >
            + Create New SOW
          </Link>
        </div>

        {/* SOW List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : sows.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-2">No SOWs yet</h2>
            <p className="text-gray-500 mb-6">Create your first protected Statement of Work</p>
            <Link
              href="/sow/new"
              className="inline-block bg-[var(--blue)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--blue-dark)] transition-colors"
            >
              Create Your First SOW
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sows.map((sow) => (
              <div key={sow.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[var(--blue)]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Grade badge */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${GRADE_COLORS[sow.scope_grade] || 'bg-gray-400'}`}>
                      {sow.scope_grade || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--navy)]">{sow.project_name}</h3>
                      <p className="text-sm text-gray-500">
                        {sow.client_name} · {sow.project_type?.replace('-', ' ')} · ${(sow.total_value || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[sow.status]}`}>
                      {sow.status}
                    </span>
                    <div className="text-sm text-gray-400">
                      Score: {sow.scope_score}/100
                    </div>
                    {sow.creep_risks && sow.creep_risks.length > 0 && (
                      <div className="text-sm text-[var(--danger)]">
                        ⚠️ {sow.creep_risks.length} risk{sow.creep_risks.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-2">
                      <Link
                        href={`/sow/${sow.id}`}
                        className="text-xs px-3 py-1.5 bg-[var(--blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/sow/${sow.id}/document`}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Document
                      </Link>
                      <button
                        onClick={() => duplicateSOW(sow)}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Duplicate
                      </button>
                      <select
                        value={sow.status}
                        onChange={(e) => updateStatus(sow.id, e.target.value)}
                        className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
