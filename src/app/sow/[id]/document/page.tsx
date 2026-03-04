'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SOW } from '@/types'
import { getGradeColor } from '@/lib/intelligence'

const IP_LABELS: Record<string, string> = {
  client_on_payment: 'All intellectual property rights transfer to Client upon receipt of final payment.',
  client_immediate: 'All intellectual property rights transfer to Client immediately upon creation.',
  freelancer_license: 'Freelancer retains all intellectual property rights. Client receives a perpetual, non-exclusive license to use deliverables.',
  shared: 'Both parties share ownership of intellectual property created during this engagement.',
}

export default function SOWDocumentPage() {
  const params = useParams()
  const router = useRouter()
  const [sow, setSow] = useState<SOW | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadSOW()
  }, [])

  async function loadSOW() {
    const { data } = await supabase
      .from('sows')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) {
      setSow(data as SOW)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading document...</div>
  }
  if (!sow) return null

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const scopeItems = (sow.scope_items || []) as { name: string; description: string }[]
  const exclusions = (sow.exclusions || []) as { name: string; description: string }[]
  const milestones = (sow.milestones || []) as { name: string; percentage: number; description: string }[]
  const creepRisks = (sow.creep_risks || []) as { phrase: string; location: string; severity: string; suggestion: string }[]
  const missingSections = (sow.missing_sections || []) as string[]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="no-print bg-[var(--navy)] text-white py-3 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">← Dashboard</Link>
            <span className="text-gray-500">|</span>
            <span className="text-sm">{sow.project_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/sow/${sow.id}/change-order`}
              className="text-sm px-4 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              📝 Create Change Order
            </Link>
            <button
              onClick={() => window.print()}
              className="text-sm px-4 py-1.5 bg-[var(--blue)] rounded-lg hover:bg-[var(--blue-dark)] transition-colors"
            >
              📥 Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="sow-document bg-white shadow-lg rounded-lg p-12" style={{ fontFamily: 'Georgia, serif' }}>
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">STATEMENT OF WORK</h1>
            <p className="text-lg text-gray-600">{sow.project_name}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: getGradeColor(sow.scope_grade || 'F') }}
              >
                Scope Score: {sow.scope_grade} ({sow.scope_score}/100)
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">1. Project Overview</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500 w-40">Date</td>
                  <td className="py-2 font-medium">{today}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Project Name</td>
                  <td className="py-2 font-medium">{sow.project_name}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Client</td>
                  <td className="py-2 font-medium">{sow.client_name}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Project Type</td>
                  <td className="py-2 font-medium capitalize">{sow.project_type?.replace('-', ' ')}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Timeline</td>
                  <td className="py-2 font-medium">{sow.timeline_weeks} weeks</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Total Value</td>
                  <td className="py-2 font-medium">${(sow.total_value || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Scope of Work */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">2. Scope of Work</h2>
            <p className="text-sm text-gray-600 mb-4">The following deliverables are included in this engagement:</p>
            <div className="space-y-3">
              {scopeItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <div>
                    <span className="font-medium text-sm">{item.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Exclusions */}
          {exclusions.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">3. Explicit Exclusions</h2>
              <p className="text-sm text-gray-600 mb-4">The following items are explicitly <strong>NOT included</strong> in this SOW:</p>
              <div className="space-y-2">
                {exclusions.map((ex, i) => (
                  <div key={i} className="flex gap-3 p-2 bg-red-50 rounded">
                    <span className="text-red-400">✕</span>
                    <div>
                      <span className="font-medium text-sm">{ex.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pricing & Payment */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">{exclusions.length > 0 ? '4' : '3'}. Pricing & Payment Schedule</h2>
            <table className="w-full text-sm mb-4">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500 w-40">Pricing Model</td>
                  <td className="py-2 font-medium capitalize">{sow.pricing_type}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">Rate</td>
                  <td className="py-2 font-medium">${sow.rate?.toLocaleString()}{sow.pricing_type === 'hourly' ? '/hour' : sow.pricing_type === 'retainer' ? '/month' : ''}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Total Value</td>
                  <td className="py-2 font-medium">${(sow.total_value || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {milestones.length > 0 && sow.total_value > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Payment Milestones</h3>
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 border-b border-gray-200">Milestone</th>
                      <th className="text-right p-2 border-b border-gray-200">%</th>
                      <th className="text-right p-2 border-b border-gray-200">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="p-2">
                          <span className="font-medium">{m.name}</span>
                          {m.description && <p className="text-xs text-gray-500">{m.description}</p>}
                        </td>
                        <td className="p-2 text-right">{m.percentage}%</td>
                        <td className="p-2 text-right font-medium">${Math.round(sow.total_value * m.percentage / 100).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Terms & Conditions */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">{exclusions.length > 0 ? '5' : '4'}. Terms & Conditions</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Revisions</h3>
                <p className="text-gray-600">This SOW includes {sow.revision_limit} round(s) of revisions per deliverable. Additional revisions will be billed at {sow.pricing_type === 'hourly' ? `the hourly rate of $${sow.rate}` : `$${sow.change_request_fee} per change request`}.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Change Requests</h3>
                <p className="text-gray-600">Any changes to the scope defined above require a written Change Order. Change requests are billed at ${sow.change_request_fee} per request, plus any additional time and materials. Both parties must approve change orders before work begins.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Cancellation / Kill Fee</h3>
                <p className="text-gray-600">If this project is cancelled by the Client, a kill fee of {sow.kill_fee_percent}% of the remaining project value will be due, in addition to payment for all work completed to date.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Intellectual Property</h3>
                <p className="text-gray-600">{IP_LABELS[sow.ip_ownership] || IP_LABELS.client_on_payment}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Timeline</h3>
                <p className="text-gray-600">The estimated timeline for this project is {sow.timeline_weeks} weeks from the project start date. This timeline assumes timely feedback and approvals from the Client. Delays in client response may extend the timeline accordingly.</p>
              </div>

              {sow.communication_terms && (
                <div>
                  <h3 className="font-semibold mb-1">Communication</h3>
                  <p className="text-gray-600">{sow.communication_terms}</p>
                </div>
              )}

              {sow.additional_terms && (
                <div>
                  <h3 className="font-semibold mb-1">Additional Terms</h3>
                  <p className="text-gray-600">{sow.additional_terms}</p>
                </div>
              )}
            </div>
          </section>

          {/* Intelligence Summary (no-print) */}
          <section className="mb-8 no-print">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">🛡️ ScopeShield Intelligence</h2>
            
            {creepRisks.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-red-600 mb-2">⚠️ Creep Risk Flags ({creepRisks.length})</h3>
                <div className="space-y-2">
                  {creepRisks.map((risk, i) => (
                    <div key={i} className="text-xs p-2 bg-red-50 rounded">
                      <span className="font-medium">&ldquo;{risk.phrase}&rdquo;</span> in {risk.location}
                      <p className="text-gray-500 mt-0.5">💡 {risk.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missingSections.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-orange-600 mb-2">📋 Missing Sections ({missingSections.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {missingSections.map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Signature Block */}
          <section className="signature-block mt-12 pt-8 border-t-2 border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Acceptance & Signatures</h2>
            <p className="text-sm text-gray-600 mb-8">By signing below, both parties agree to the terms and scope outlined in this Statement of Work.</p>
            
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-6">FREELANCER / SERVICE PROVIDER</p>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-xs text-gray-500">Signature</p>
                <div className="border-b border-gray-400 mb-2 mt-4 h-8"></div>
                <p className="text-xs text-gray-500">Printed Name</p>
                <div className="border-b border-gray-400 mb-2 mt-4 h-8"></div>
                <p className="text-xs text-gray-500">Date</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-6">CLIENT — {sow.client_name?.toUpperCase()}</p>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <p className="text-xs text-gray-500">Signature</p>
                <div className="border-b border-gray-400 mb-2 mt-4 h-8"></div>
                <p className="text-xs text-gray-500">Printed Name</p>
                <div className="border-b border-gray-400 mb-2 mt-4 h-8"></div>
                <p className="text-xs text-gray-500">Date</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">Generated by ScopeShield — Scope Creep Protection Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  )
}
