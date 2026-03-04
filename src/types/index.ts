export interface Profile {
  id: string
  full_name: string
  company_name: string | null
  email: string
  default_rate: number | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  client_name: string
  project_type: string
  status: 'draft' | 'sent' | 'active' | 'completed'
  total_value: number
  created_at: string
  updated_at: string
}

export interface ScopeItem {
  id: string
  name: string
  description: string
  included: boolean
}

export interface Exclusion {
  id: string
  name: string
  description: string
}

export interface Milestone {
  id: string
  name: string
  percentage: number
  description: string
}

export interface CreepRisk {
  phrase: string
  location: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

export interface SOW {
  id: string
  project_id: string
  user_id: string
  project_name: string
  client_name: string
  project_type: string
  scope_items: ScopeItem[]
  exclusions: Exclusion[]
  pricing_type: 'fixed' | 'hourly' | 'retainer'
  rate: number
  total_value: number
  milestones: Milestone[]
  revision_limit: number
  change_request_fee: number
  kill_fee_percent: number
  ip_ownership: string
  timeline_weeks: number
  communication_terms: string | null
  additional_terms: string | null
  scope_score: number
  scope_grade: string
  creep_risks: CreepRisk[]
  missing_sections: string[]
  status: 'draft' | 'sent' | 'active' | 'completed'
  created_at: string
  updated_at: string
}

export interface ChangeOrder {
  id: string
  sow_id: string
  user_id: string
  description: string
  reason: string | null
  additional_cost: number
  additional_time_days: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type ProjectType =
  | 'web-development'
  | 'graphic-design'
  | 'marketing'
  | 'consulting'
  | 'video-production'
  | 'photography'
  | 'writing'
  | 'custom'

export interface SOWWizardData {
  // Step 1
  projectName: string
  clientName: string
  projectType: ProjectType
  // Step 2
  scopeItems: ScopeItem[]
  exclusions: Exclusion[]
  customScopeItems: ScopeItem[]
  // Step 3
  pricingType: 'fixed' | 'hourly' | 'retainer'
  rate: number
  totalValue: number
  milestones: Milestone[]
  // Step 4
  revisionLimit: number
  changeRequestFee: number
  killFeePercent: number
  ipOwnership: string
  timelineWeeks: number
  communicationTerms: string
  additionalTerms: string
}
