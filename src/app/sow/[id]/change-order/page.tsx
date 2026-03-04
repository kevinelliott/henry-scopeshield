'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Link from 'next/link'
import type { SOW } from '@/types'

export default function ChangeOrderPage() {
  const params = useParams()
  const router = useRouter()
  const [sow, setSow] = useState<SOW | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')
  const [additionalCost, setAdditionalCost] = useState(0)
  const [additionalDays, setAdditionalDays] = useState(0)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    await supabase.from('change_orders').insert({
      sow_id: sow!.id,
      user_id: user.id,
      description,
      reason,
      additional_cost: additionalCost,
      additional_time_days: additionalDays,
      status: 'pending',
    })

    setSaving(false)
    router.push(`/sow/${sow!.id}`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  if (!sow) return null

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href={`/sow/${sow.id}`} className="text-sm text-gray-500 hover:text-[var(--blue)]">← Back to SOW</Link>
        
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-4">
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-[var(--navy)]">CHANGE ORDER REQUEST</h1>
            <p className="text-gray-500 text-sm mt-1">Reference SOW: {sow.project_name}</p>
            <p className="text-gray-400 text-xs mt-1">Date: {today}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
            <h3 className="font-semibold text-[var(--navy)] mb-2">Original SOW Details</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-500">Client:</span> {sow.client_name}</div>
              <div><span className="text-gray-500">Value:</span> ${(sow.total_value || 0).toLocaleString()}</div>
              <div><span className="text-gray-500">Timeline:</span> {sow.timeline_weeks} weeks</div>
              <div><span className="text-gray-500">Change Fee:</span> ${sow.change_request_fee}/request</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                placeholder="Describe the requested change in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                placeholder="Why is this change needed?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Cost ($)</label>
                <input
                  type="number"
                  value={additionalCost || ''}
                  onChange={e => setAdditionalCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Time (days)</label>
                <input
                  type="number"
                  value={additionalDays || ''}
                  onChange={e => setAdditionalDays(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-yellow-800">⚠️ Change Order Fee: ${sow.change_request_fee}</p>
              <p className="text-yellow-700 text-xs mt-1">Per the original SOW, each change request incurs a fee of ${sow.change_request_fee} in addition to any additional cost for the work itself.</p>
              <p className="text-yellow-800 font-medium mt-2">Total Impact: ${(additionalCost + (sow.change_request_fee || 0)).toLocaleString()} + {additionalDays} additional day(s)</p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[var(--blue)] text-white rounded-lg font-medium hover:bg-[var(--blue-dark)] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Submit Change Order'}
              </button>
              <Link
                href={`/sow/${sow.id}`}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
