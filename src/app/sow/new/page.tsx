'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import type { SOWWizardData, ProjectType, ScopeItem, Exclusion, Milestone } from '@/types'
import { getTemplateItems, getDefaultMilestones, PROJECT_TEMPLATES } from '@/lib/templates'
import { calculateScopeScore, analyzeCreepRisks, detectMissingSections, benchmarkRate, calculateMilestones, getGradeColor } from '@/lib/intelligence'

const STEPS = ['Project Basics', 'Scope & Exclusions', 'Pricing & Milestones', 'Terms & Protections', 'Review & Score']

function makeId() {
  return Math.random().toString(36).substring(2, 11)
}

const initialData: SOWWizardData = {
  projectName: '',
  clientName: '',
  projectType: 'web-development',
  scopeItems: [],
  exclusions: [],
  customScopeItems: [],
  pricingType: 'fixed',
  rate: 0,
  totalValue: 0,
  milestones: [],
  revisionLimit: 2,
  changeRequestFee: 75,
  killFeePercent: 25,
  ipOwnership: 'client_on_payment',
  timelineWeeks: 4,
  communicationTerms: 'Communication via email during business hours (Mon-Fri, 9am-5pm). Response within 1 business day. Weekly status updates every Monday.',
  additionalTerms: '',
}

export default function NewSOWPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<SOWWizardData>(initialData)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const updateData = (updates: Partial<SOWWizardData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const handleTypeChange = (type: ProjectType) => {
    const { scopeItems, exclusions } = getTemplateItems(type)
    updateData({ projectType: type, scopeItems, exclusions })
  }

  const handleNext = () => {
    if (step === 0 && data.scopeItems.length === 0) {
      const { scopeItems, exclusions } = getTemplateItems(data.projectType)
      updateData({ scopeItems, exclusions })
    }
    if (step === 2 && data.milestones.length === 0) {
      const milestones = getDefaultMilestones(data.pricingType, data.totalValue)
      updateData({ milestones })
    }
    setStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const scoreResult = calculateScopeScore(data)
    const creepRisks = analyzeCreepRisks(data)
    const missingSections = detectMissingSections(data)

    // Create project first
    const { data: project } = await supabase.from('projects').insert({
      user_id: user.id,
      name: data.projectName,
      client_name: data.clientName,
      project_type: data.projectType,
      status: 'draft',
      total_value: data.totalValue,
    }).select().single()

    if (!project) { setSaving(false); return }

    // Create SOW
    const { data: sow } = await supabase.from('sows').insert({
      project_id: project.id,
      user_id: user.id,
      project_name: data.projectName,
      client_name: data.clientName,
      project_type: data.projectType,
      scope_items: data.scopeItems.filter(i => i.included),
      exclusions: data.exclusions,
      pricing_type: data.pricingType,
      rate: data.rate,
      total_value: data.totalValue,
      milestones: data.milestones,
      revision_limit: data.revisionLimit,
      change_request_fee: data.changeRequestFee,
      kill_fee_percent: data.killFeePercent,
      ip_ownership: data.ipOwnership,
      timeline_weeks: data.timelineWeeks,
      communication_terms: data.communicationTerms,
      additional_terms: data.additionalTerms,
      scope_score: scoreResult.score,
      scope_grade: scoreResult.grade,
      creep_risks: creepRisks,
      missing_sections: missingSections,
      status: 'draft',
    }).select().single()

    if (sow) {
      router.push(`/sow/${sow.id}/document`)
    }
    setSaving(false)
  }

  // Calculate intelligence for review step
  const scoreResult = calculateScopeScore(data)
  const creepRisks = analyzeCreepRisks(data)
  const missingSections = detectMissingSections(data)
  const rateBenchmark = data.rate > 0 ? benchmarkRate(data.projectType, data.rate) : null
  const milestoneCalc = calculateMilestones(data.pricingType, data.totalValue, data.milestones)

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i <= step ? setStep(i) : null}
                className={`flex items-center gap-2 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${i < step ? 'bg-[var(--blue)] text-white' : i === step ? 'bg-[var(--navy)] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm hidden md:block ${i <= step ? 'text-[var(--navy)] font-medium' : 'text-gray-400'}`}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`w-8 lg:w-16 h-0.5 mx-2 ${i < step ? 'bg-[var(--blue)]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Project Basics */}
        {step === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Project Basics</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={data.projectName}
                  onChange={e => updateData({ projectName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="e.g., E-Commerce Website Redesign"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={e => updateData({ clientName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Project Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.values(PROJECT_TEMPLATES).map(template => (
                    <button
                      key={template.type}
                      onClick={() => handleTypeChange(template.type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all
                        ${data.projectType === template.type
                          ? 'border-[var(--blue)] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="text-2xl mb-1">{template.icon}</div>
                      <div className="text-sm font-medium text-[var(--navy)]">{template.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Scope & Exclusions */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Scope Items</h2>
            <p className="text-gray-500 text-sm mb-6">Check items that are included. Unchecked items will NOT be in scope.</p>
            
            <div className="space-y-2 mb-8">
              {data.scopeItems.map((item, idx) => (
                <label key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${item.included ? 'border-[var(--blue)]/30 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={item.included}
                    onChange={() => {
                      const items = [...data.scopeItems]
                      items[idx] = { ...items[idx], included: !items[idx].included }
                      updateData({ scopeItems: items })
                    }}
                    className="mt-1 w-4 h-4 text-[var(--blue)] rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-[var(--navy)]">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Add custom scope item */}
            <button
              onClick={() => {
                const newItem: ScopeItem = { id: makeId(), name: '', description: '', included: true }
                updateData({ scopeItems: [...data.scopeItems, newItem] })
              }}
              className="text-sm text-[var(--blue)] hover:underline mb-8"
            >
              + Add Custom Scope Item
            </button>

            <hr className="my-6 border-gray-200" />

            <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Explicit Exclusions</h2>
            <p className="text-gray-500 text-sm mb-4">🛡️ This is your key protection. Define what is NOT included.</p>
            
            <div className="space-y-2 mb-4">
              {data.exclusions.map((ex, idx) => (
                <div key={ex.id} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ex.name}
                      onChange={e => {
                        const exs = [...data.exclusions]
                        exs[idx] = { ...exs[idx], name: e.target.value }
                        updateData({ exclusions: exs })
                      }}
                      className="w-full font-medium text-sm text-[var(--navy)] bg-transparent border-none outline-none"
                      placeholder="Exclusion name"
                    />
                    <input
                      type="text"
                      value={ex.description}
                      onChange={e => {
                        const exs = [...data.exclusions]
                        exs[idx] = { ...exs[idx], description: e.target.value }
                        updateData({ exclusions: exs })
                      }}
                      className="w-full text-xs text-gray-500 bg-transparent border-none outline-none mt-0.5"
                      placeholder="Description of what's excluded"
                    />
                  </div>
                  <button
                    onClick={() => updateData({ exclusions: data.exclusions.filter((_, i) => i !== idx) })}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newEx: Exclusion = { id: makeId(), name: '', description: '' }
                updateData({ exclusions: [...data.exclusions, newEx] })
              }}
              className="text-sm text-[var(--blue)] hover:underline"
            >
              + Add Exclusion
            </button>
          </div>
        )}

        {/* Step 3: Pricing & Milestones */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Pricing & Milestones</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pricing Model</label>
                <div className="flex gap-3">
                  {(['fixed', 'hourly', 'retainer'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => updateData({ pricingType: type })}
                      className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all capitalize
                        ${data.pricingType === type ? 'border-[var(--blue)] bg-blue-50 text-[var(--blue)]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {type === 'fixed' ? 'Fixed Price' : type === 'hourly' ? 'Hourly Rate' : 'Monthly Retainer'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {data.pricingType === 'hourly' ? 'Hourly Rate ($)' : data.pricingType === 'retainer' ? 'Monthly Rate ($)' : 'Rate ($/hr for reference)'}
                  </label>
                  <input
                    type="number"
                    value={data.rate || ''}
                    onChange={e => updateData({ rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                    placeholder="125"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Project Value ($)</label>
                  <input
                    type="number"
                    value={data.totalValue || ''}
                    onChange={e => updateData({ totalValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Rate Benchmark */}
              {data.rate > 0 && rateBenchmark && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[var(--navy)] mb-3">📊 Rate Benchmark — {PROJECT_TEMPLATES[data.projectType].name}</h3>
                  <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-full rounded-full" />
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-[var(--navy)] rounded"
                      style={{ left: `${Math.min(rateBenchmark.percentile, 98)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>${rateBenchmark.low}/hr</span>
                    <span>${rateBenchmark.median}/hr (median)</span>
                    <span>${rateBenchmark.high}/hr</span>
                  </div>
                  <p className="text-sm text-gray-600">{rateBenchmark.assessment}</p>
                </div>
              )}

              {/* Milestones */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--navy)] mb-3">Payment Milestones</h3>
                {data.milestones.length === 0 && (
                  <p className="text-sm text-gray-400 mb-2">Milestones will be auto-calculated based on your pricing model and project value.</p>
                )}
                <div className="space-y-2">
                  {data.milestones.map((m, idx) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={m.name}
                        onChange={e => {
                          const ms = [...data.milestones]
                          ms[idx] = { ...ms[idx], name: e.target.value }
                          updateData({ milestones: ms })
                        }}
                        className="flex-1 text-sm bg-transparent border-none outline-none font-medium"
                        placeholder="Milestone name"
                      />
                      <input
                        type="number"
                        value={m.percentage}
                        onChange={e => {
                          const ms = [...data.milestones]
                          ms[idx] = { ...ms[idx], percentage: parseInt(e.target.value) || 0 }
                          updateData({ milestones: ms })
                        }}
                        className="w-20 text-sm text-center bg-white border border-gray-200 rounded px-2 py-1"
                        placeholder="%"
                      />
                      <span className="text-sm text-gray-500 w-24 text-right">
                        ${data.totalValue > 0 ? Math.round(data.totalValue * m.percentage / 100).toLocaleString() : '0'}
                      </span>
                      <button
                        onClick={() => updateData({ milestones: data.milestones.filter((_, i) => i !== idx) })}
                        className="text-gray-400 hover:text-red-500"
                      >×</button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateData({ milestones: [...data.milestones, { id: makeId(), name: '', percentage: 0, description: '' }] })}
                  className="text-sm text-[var(--blue)] hover:underline mt-2"
                >
                  + Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Terms & Protections */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Terms & Protections</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revision Limit</label>
                  <input
                    type="number"
                    value={data.revisionLimit}
                    onChange={e => updateData({ revisionLimit: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Rounds of revision per deliverable</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Request Fee ($)</label>
                  <input
                    type="number"
                    value={data.changeRequestFee || ''}
                    onChange={e => updateData({ changeRequestFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Fee per change request beyond scope</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kill Fee (%)</label>
                  <input
                    type="number"
                    value={data.killFeePercent}
                    onChange={e => updateData({ killFeePercent: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">% of remaining value on cancellation</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline (weeks)</label>
                  <input
                    type="number"
                    value={data.timelineWeeks}
                    onChange={e => updateData({ timelineWeeks: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IP Ownership</label>
                <select
                  value={data.ipOwnership}
                  onChange={e => updateData({ ipOwnership: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none bg-white"
                >
                  <option value="client_on_payment">Client owns IP upon full payment</option>
                  <option value="client_immediate">Client owns IP immediately</option>
                  <option value="freelancer_license">Freelancer retains IP, client gets license</option>
                  <option value="shared">Shared ownership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Terms</label>
                <textarea
                  value={data.communicationTerms}
                  onChange={e => updateData({ communicationTerms: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="Describe expected communication channels, response times, and meeting schedule..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Terms</label>
                <textarea
                  value={data.additionalTerms}
                  onChange={e => updateData({ additionalTerms: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                  placeholder="Any other terms, conditions, or notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Score */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--navy)]">SOW Intelligence Report</h2>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: getGradeColor(scoreResult.grade) }}
                  >
                    {scoreResult.grade}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--navy)]">{scoreResult.score}/100</div>
                    <div className="text-sm text-gray-500">Scope Score</div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3 mb-6">
                {scoreResult.breakdown.map(b => (
                  <div key={b.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{b.category}</span>
                      <span className="text-gray-500">{b.score}/{b.max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(b.score / b.max) * 100}%`,
                          backgroundColor: b.score / b.max >= 0.8 ? 'var(--success)' : b.score / b.max >= 0.5 ? 'var(--warning)' : 'var(--danger)',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{b.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Creep Risks */}
            {creepRisks.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--navy)] mb-4">
                  ⚠️ Creep Risk Analysis ({creepRisks.length} issue{creepRisks.length !== 1 ? 's' : ''})
                </h3>
                <div className="space-y-3">
                  {creepRisks.map((risk, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${
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
                        <span className="text-sm font-medium text-gray-800">&ldquo;{risk.phrase}&rdquo;</span>
                      </div>
                      <p className="text-xs text-gray-500">Found in: {risk.location}</p>
                      <p className="text-sm text-gray-700 mt-1">💡 {risk.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Sections */}
            {missingSections.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--navy)] mb-4">
                  📋 Missing Sections ({missingSections.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {missingSections.map(section => (
                    <div key={section} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <span className="text-orange-400">○</span>
                      <span className="text-sm text-gray-700">{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestone Calculator */}
            {milestoneCalc.length > 0 && data.totalValue > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--navy)] mb-4">💰 Payment Schedule</h3>
                <div className="space-y-2">
                  {milestoneCalc.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-sm text-[var(--navy)]">{m.name}</span>
                        <p className="text-xs text-gray-500">{m.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[var(--navy)]">${m.amount.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1">({m.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Benchmark on Review */}
            {rateBenchmark && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[var(--navy)] mb-4">📊 Rate Benchmark</h3>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-full rounded-full" />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[var(--navy)] rounded"
                    style={{ left: `${Math.min(rateBenchmark.percentile, 98)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>${rateBenchmark.low}/hr (low)</span>
                  <span>${rateBenchmark.median}/hr (median)</span>
                  <span>${rateBenchmark.high}/hr (high)</span>
                </div>
                <p className="text-sm text-gray-600">{rateBenchmark.assessment}</p>
              </div>
            )}

            {/* SOW Summary */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[var(--navy)] mb-4">📄 SOW Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Project:</span> <span className="font-medium">{data.projectName || '—'}</span></div>
                <div><span className="text-gray-500">Client:</span> <span className="font-medium">{data.clientName || '—'}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{data.projectType.replace('-', ' ')}</span></div>
                <div><span className="text-gray-500">Value:</span> <span className="font-medium">${data.totalValue.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Timeline:</span> <span className="font-medium">{data.timelineWeeks} weeks</span></div>
                <div><span className="text-gray-500">Revisions:</span> <span className="font-medium">{data.revisionLimit} rounds</span></div>
                <div><span className="text-gray-500">Scope items:</span> <span className="font-medium">{data.scopeItems.filter(i => i.included).length}</span></div>
                <div><span className="text-gray-500">Exclusions:</span> <span className="font-medium">{data.exclusions.length}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(prev => Math.max(prev - 1, 0))}
            className={`px-6 py-2.5 rounded-lg font-medium ${step === 0 ? 'invisible' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[var(--blue)] text-white rounded-lg font-medium hover:bg-[var(--blue-dark)] transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 bg-[var(--success)] text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : '🛡️ Save & Generate Document'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
