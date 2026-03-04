import { SOWWizardData, CreepRisk, ProjectType } from '@/types'
import { PROJECT_TEMPLATES } from './templates'

// ==========================================
// LAYER 1: Scope Completeness Score (A-F, 0-100)
// ==========================================

interface ScopeScoreResult {
  score: number
  grade: string
  breakdown: { category: string; score: number; max: number; details: string }[]
}

export function calculateScopeScore(data: SOWWizardData): ScopeScoreResult {
  const breakdown: ScopeScoreResult['breakdown'] = []
  
  // Project basics (15 points)
  let basicsScore = 0
  if (data.projectName) basicsScore += 5
  if (data.clientName) basicsScore += 5
  if (data.projectType) basicsScore += 5
  breakdown.push({ category: 'Project Basics', score: basicsScore, max: 15, details: basicsScore === 15 ? 'All project details defined' : 'Missing some project basics' })

  // Scope items (25 points)
  const includedItems = data.scopeItems.filter(i => i.included)
  const scopeScore = Math.min(25, Math.round((includedItems.length / 8) * 25))
  breakdown.push({ category: 'Scope Depth', score: scopeScore, max: 25, details: `${includedItems.length} scope items defined` })

  // Exclusions (15 points)
  const exclusionScore = Math.min(15, data.exclusions.length * 3)
  breakdown.push({ category: 'Explicit Exclusions', score: exclusionScore, max: 15, details: data.exclusions.length > 0 ? `${data.exclusions.length} exclusions defined — great protection` : 'No exclusions defined — major risk!' })

  // Pricing & milestones (15 points)
  let pricingScore = 0
  if (data.rate > 0) pricingScore += 5
  if (data.milestones.length > 0) pricingScore += 5
  if (data.milestones.length >= 3) pricingScore += 5
  breakdown.push({ category: 'Pricing & Milestones', score: pricingScore, max: 15, details: pricingScore === 15 ? 'Detailed milestone payment schedule' : 'Pricing structure needs more detail' })

  // Terms & protections (20 points)
  let termsScore = 0
  if (data.revisionLimit > 0) termsScore += 4
  if (data.changeRequestFee > 0) termsScore += 4
  if (data.killFeePercent > 0) termsScore += 4
  if (data.ipOwnership) termsScore += 4
  if (data.timelineWeeks > 0) termsScore += 4
  breakdown.push({ category: 'Terms & Protections', score: termsScore, max: 20, details: termsScore >= 16 ? 'Strong protective terms' : 'Missing protective clauses — add more protections' })

  // Communication (10 points)
  let commScore = 0
  if (data.communicationTerms && data.communicationTerms.length > 10) commScore += 5
  if (data.additionalTerms && data.additionalTerms.length > 10) commScore += 5
  breakdown.push({ category: 'Communication & Additional Terms', score: commScore, max: 10, details: commScore > 0 ? 'Communication expectations documented' : 'Define communication expectations' })

  const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0)
  const grade = getGrade(totalScore)

  return { score: totalScore, grade, breakdown }
}

function getGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#22c55e'
    case 'B': return '#84cc16'
    case 'C': return '#eab308'
    case 'D': return '#f97316'
    case 'F': return '#ef4444'
    default: return '#6b7280'
  }
}

// ==========================================
// LAYER 2: Creep Risk Analysis
// ==========================================

const VAGUE_PHRASES: { pattern: RegExp; phrase: string; severity: CreepRisk['severity']; suggestion: string }[] = [
  { pattern: /as needed/gi, phrase: 'as needed', severity: 'high', suggestion: 'Replace with specific quantity or frequency: "up to 3 revisions" or "bi-weekly check-ins"' },
  { pattern: /and other tasks/gi, phrase: 'and other tasks', severity: 'high', suggestion: 'Remove or replace with an explicit list of all tasks included' },
  { pattern: /ongoing support/gi, phrase: 'ongoing support', severity: 'high', suggestion: 'Define specific duration and scope: "2 weeks post-launch bug fixes for delivered features only"' },
  { pattern: /reasonable revisions/gi, phrase: 'reasonable revisions', severity: 'high', suggestion: 'Specify exact number: "up to 2 rounds of revisions per deliverable"' },
  { pattern: /and similar/gi, phrase: 'and similar', severity: 'medium', suggestion: 'List all specific items instead of using catch-all language' },
  { pattern: /as required/gi, phrase: 'as required', severity: 'high', suggestion: 'Define specific requirements and quantities upfront' },
  { pattern: /etc\.?/gi, phrase: 'etc.', severity: 'medium', suggestion: 'List all items explicitly — "etc." leaves scope open to interpretation' },
  { pattern: /whatever is needed/gi, phrase: 'whatever is needed', severity: 'high', suggestion: 'Replace with specific deliverables and quantities' },
  { pattern: /unlimited/gi, phrase: 'unlimited', severity: 'high', suggestion: 'Always set limits — "unlimited" is a recipe for burnout and scope creep' },
  { pattern: /general support/gi, phrase: 'general support', severity: 'medium', suggestion: 'Define exactly what support includes: channels, hours, response time' },
  { pattern: /miscellaneous/gi, phrase: 'miscellaneous', severity: 'medium', suggestion: 'Remove or categorize all items explicitly' },
  { pattern: /any changes/gi, phrase: 'any changes', severity: 'medium', suggestion: 'Define what types of changes are included and their limits' },
  { pattern: /all necessary/gi, phrase: 'all necessary', severity: 'medium', suggestion: 'Define specifically what is included rather than "all" of something' },
  { pattern: /regular updates/gi, phrase: 'regular updates', severity: 'low', suggestion: 'Specify frequency: "weekly status updates every Monday by 5pm"' },
  { pattern: /timely manner/gi, phrase: 'timely manner', severity: 'low', suggestion: 'Define specific timeframes: "within 2 business days"' },
  { pattern: /best effort/gi, phrase: 'best effort', severity: 'medium', suggestion: 'Define concrete deliverables and success criteria instead' },
  { pattern: /may include/gi, phrase: 'may include', severity: 'medium', suggestion: 'Use "includes" with a definitive list, or "does not include" for exclusions' },
  { pattern: /approximately/gi, phrase: 'approximately', severity: 'low', suggestion: 'Use specific numbers or defined ranges: "8-12 pages" instead of "approximately 10"' },
  { pattern: /up to client/gi, phrase: 'up to client', severity: 'medium', suggestion: 'Define the default behavior and what happens if the client doesn\'t respond' },
  { pattern: /TBD|to be determined/gi, phrase: 'TBD / to be determined', severity: 'high', suggestion: 'Resolve before signing — undefined items become scope creep vectors' },
]

export function analyzeCreepRisks(data: SOWWizardData): CreepRisk[] {
  const risks: CreepRisk[] = []
  
  // Scan all text fields
  const fieldsToScan: { text: string; location: string }[] = [
    ...data.scopeItems.filter(i => i.included).map(i => ({ text: i.description, location: `Scope item: "${i.name}"` })),
    ...data.exclusions.map(e => ({ text: e.description, location: `Exclusion: "${e.name}"` })),
    { text: data.communicationTerms || '', location: 'Communication Terms' },
    { text: data.additionalTerms || '', location: 'Additional Terms' },
    ...data.milestones.map(m => ({ text: m.description, location: `Milestone: "${m.name}"` })),
  ]

  for (const field of fieldsToScan) {
    if (!field.text) continue
    for (const vp of VAGUE_PHRASES) {
      if (vp.pattern.test(field.text)) {
        // Reset lastIndex for global regex
        vp.pattern.lastIndex = 0
        risks.push({
          phrase: vp.phrase,
          location: field.location,
          severity: vp.severity,
          suggestion: vp.suggestion,
        })
      }
    }
  }

  // Structural risks
  if (data.exclusions.length === 0) {
    risks.push({
      phrase: 'No exclusions defined',
      location: 'Scope Definition',
      severity: 'high',
      suggestion: 'Add explicit exclusions — what you DON\'T do is as important as what you DO. Clients assume everything is included unless stated otherwise.',
    })
  }

  if (data.revisionLimit === 0) {
    risks.push({
      phrase: 'No revision limit set',
      location: 'Terms & Protections',
      severity: 'high',
      suggestion: 'Set a specific revision limit (2-3 rounds is standard). Without limits, clients may request endless revisions.',
    })
  }

  if (data.changeRequestFee === 0) {
    risks.push({
      phrase: 'No change request fee',
      location: 'Terms & Protections',
      severity: 'medium',
      suggestion: 'Set a change request fee to discourage casual scope changes. Even a small fee makes clients think twice.',
    })
  }

  if (data.killFeePercent === 0) {
    risks.push({
      phrase: 'No kill fee / cancellation clause',
      location: 'Terms & Protections',
      severity: 'medium',
      suggestion: 'Add a kill fee (25-50% of remaining value is standard) to protect against sudden cancellation.',
    })
  }

  const includedItems = data.scopeItems.filter(i => i.included)
  if (includedItems.length > 0) {
    const vagueItems = includedItems.filter(i => i.description.length < 20)
    if (vagueItems.length > 0) {
      risks.push({
        phrase: `${vagueItems.length} scope item(s) with vague descriptions`,
        location: 'Scope Items',
        severity: 'medium',
        suggestion: 'Add more detail to scope item descriptions. Specific descriptions = fewer disputes.',
      })
    }
  }

  return risks
}

// ==========================================
// LAYER 3: Missing Section Detection
// ==========================================

const REQUIRED_SECTIONS = [
  { name: 'Project Overview', check: (d: SOWWizardData) => !!d.projectName && !!d.clientName },
  { name: 'Scope of Work / Deliverables', check: (d: SOWWizardData) => d.scopeItems.filter(i => i.included).length > 0 },
  { name: 'Explicit Exclusions', check: (d: SOWWizardData) => d.exclusions.length > 0 },
  { name: 'Timeline / Schedule', check: (d: SOWWizardData) => d.timelineWeeks > 0 },
  { name: 'Payment Terms', check: (d: SOWWizardData) => d.rate > 0 },
  { name: 'Milestone Schedule', check: (d: SOWWizardData) => d.milestones.length > 0 },
  { name: 'Revision Limits', check: (d: SOWWizardData) => d.revisionLimit > 0 },
  { name: 'Change Request Process', check: (d: SOWWizardData) => d.changeRequestFee > 0 },
  { name: 'Kill Fee / Cancellation Clause', check: (d: SOWWizardData) => d.killFeePercent > 0 },
  { name: 'IP Ownership Clause', check: (d: SOWWizardData) => !!d.ipOwnership },
  { name: 'Communication Terms', check: (d: SOWWizardData) => !!d.communicationTerms && d.communicationTerms.length > 5 },
  { name: 'Acceptance Criteria', check: (d: SOWWizardData) => d.additionalTerms?.toLowerCase().includes('acceptance') || d.additionalTerms?.toLowerCase().includes('approval') || false },
]

export function detectMissingSections(data: SOWWizardData): string[] {
  return REQUIRED_SECTIONS
    .filter(section => !section.check(data))
    .map(section => section.name)
}

// ==========================================
// LAYER 4: Rate Benchmarking
// ==========================================

export interface RateBenchmark {
  low: number
  median: number
  high: number
  userRate: number
  percentile: number
  assessment: string
}

export function benchmarkRate(projectType: ProjectType, rate: number): RateBenchmark {
  const template = PROJECT_TEMPLATES[projectType]
  const { low, median, high } = template.averageRate

  let percentile: number
  if (rate <= low) {
    percentile = Math.round((rate / low) * 25)
  } else if (rate <= median) {
    percentile = 25 + Math.round(((rate - low) / (median - low)) * 25)
  } else if (rate <= high) {
    percentile = 50 + Math.round(((rate - median) / (high - median)) * 25)
  } else {
    percentile = Math.min(99, 75 + Math.round(((rate - high) / high) * 25))
  }

  let assessment: string
  if (rate < low) {
    assessment = 'Below market rate. Consider raising your rates — you may be undervaluing your work.'
  } else if (rate < median) {
    assessment = 'Below median market rate. Competitive pricing but room to grow.'
  } else if (rate <= high) {
    assessment = 'At or above median market rate. Strong positioning for experienced professionals.'
  } else {
    assessment = 'Premium rate. Make sure your SOW reflects premium-level deliverables and service.'
  }

  return { low, median, high, userRate: rate, percentile, assessment }
}

// ==========================================
// LAYER 5: Change Order Template (generated in document)
// ==========================================

export interface ChangeOrderData {
  sowProjectName: string
  sowDate: string
  changeDescription: string
  reason: string
  additionalCost: number
  additionalTimeDays: number
  impactOnExisting: string
}

export function generateChangeOrderTemplate(sowProjectName: string): ChangeOrderData {
  return {
    sowProjectName,
    sowDate: new Date().toISOString().split('T')[0],
    changeDescription: '',
    reason: '',
    additionalCost: 0,
    additionalTimeDays: 0,
    impactOnExisting: '',
  }
}

// ==========================================
// LAYER 6: Milestone Payment Calculator
// ==========================================

export interface MilestoneCalculation {
  name: string
  percentage: number
  amount: number
  description: string
}

export function calculateMilestones(
  pricingType: string,
  totalValue: number,
  customMilestones?: { name: string; percentage: number; description: string }[]
): MilestoneCalculation[] {
  if (customMilestones && customMilestones.length > 0) {
    return customMilestones.map(m => ({
      ...m,
      amount: Math.round((m.percentage / 100) * totalValue * 100) / 100,
    }))
  }

  if (pricingType === 'hourly') {
    return [
      { name: 'Deposit', percentage: 20, amount: totalValue * 0.2, description: 'Upfront deposit before work begins' },
      { name: 'Bi-Weekly Invoice', percentage: 80, amount: totalValue * 0.8, description: 'Billed bi-weekly based on hours tracked' },
    ]
  }

  if (pricingType === 'retainer') {
    return [
      { name: 'Monthly Retainer', percentage: 100, amount: totalValue, description: 'Due at the beginning of each month' },
    ]
  }

  // Fixed price
  if (totalValue <= 5000) {
    return [
      { name: 'Upfront Payment', percentage: 50, amount: totalValue * 0.5, description: 'Due upon contract signing' },
      { name: 'Final Payment', percentage: 50, amount: totalValue * 0.5, description: 'Due upon final delivery' },
    ]
  }

  if (totalValue <= 15000) {
    return [
      { name: 'Project Kickoff', percentage: 30, amount: totalValue * 0.3, description: 'Due upon contract signing' },
      { name: 'Midpoint Delivery', percentage: 30, amount: totalValue * 0.3, description: 'Due at project midpoint' },
      { name: 'Final Delivery', percentage: 40, amount: totalValue * 0.4, description: 'Due upon final delivery and acceptance' },
    ]
  }

  return [
    { name: 'Project Kickoff', percentage: 25, amount: totalValue * 0.25, description: 'Due upon contract signing' },
    { name: 'Phase 1 Complete', percentage: 25, amount: totalValue * 0.25, description: 'Due upon Phase 1 delivery' },
    { name: 'Phase 2 Complete', percentage: 25, amount: totalValue * 0.25, description: 'Due upon Phase 2 delivery' },
    { name: 'Final Delivery', percentage: 25, amount: totalValue * 0.25, description: 'Due upon final delivery and acceptance' },
  ]
}
