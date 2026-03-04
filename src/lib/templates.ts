import { ScopeItem, Exclusion, Milestone, ProjectType } from '@/types'

function makeId() {
  return Math.random().toString(36).substring(2, 11)
}

export interface ProjectTemplate {
  name: string
  type: ProjectType
  label: string
  icon: string
  scopeItems: Omit<ScopeItem, 'id'>[]
  exclusions: Omit<Exclusion, 'id'>[]
  averageRate: { low: number; median: number; high: number }
}

export const PROJECT_TEMPLATES: Record<ProjectType, ProjectTemplate> = {
  'web-development': {
    name: 'Web Development',
    type: 'web-development',
    label: 'Web Development',
    icon: '💻',
    scopeItems: [
      { name: 'Discovery & Requirements', description: 'Initial meetings, requirements gathering, and project scoping documentation', included: true },
      { name: 'Wireframes & Prototyping', description: 'Low-fidelity wireframes for all key pages and user flows', included: true },
      { name: 'UI/UX Design Comps', description: 'High-fidelity design mockups for desktop and mobile breakpoints', included: true },
      { name: 'Frontend Development', description: 'HTML/CSS/JS implementation of approved designs with responsive behavior', included: true },
      { name: 'Backend Development', description: 'Server-side logic, API development, and database architecture', included: true },
      { name: 'CMS Integration', description: 'Content management system setup and configuration for client-managed content', included: true },
      { name: 'Third-Party Integrations', description: 'Integration with specified external APIs and services (list explicitly)', included: false },
      { name: 'Testing & QA', description: 'Cross-browser testing, responsive testing, and bug fixes on major browsers', included: true },
      { name: 'Performance Optimization', description: 'Page speed optimization, image compression, and caching setup', included: true },
      { name: 'Deployment & Launch', description: 'Production server setup, DNS configuration, SSL certificate, and go-live', included: true },
      { name: 'Post-Launch Support', description: '2-week post-launch bug fix period for issues related to delivered scope', included: true },
      { name: 'Training & Documentation', description: 'Client training session and user documentation for CMS and admin areas', included: true },
      { name: 'SEO Setup', description: 'Basic on-page SEO: meta tags, sitemap, robots.txt, schema markup', included: false },
      { name: 'Analytics Setup', description: 'Google Analytics / tracking pixel installation and basic dashboard configuration', included: false },
    ],
    exclusions: [
      { name: 'Ongoing maintenance', description: 'Monthly maintenance, updates, or hosting management after launch' },
      { name: 'Content creation', description: 'Copywriting, photography, video production, or content strategy' },
      { name: 'Additional pages beyond scope', description: 'Any pages not explicitly listed in the scope items above' },
      { name: 'Custom animations', description: 'Complex motion graphics, Lottie animations, or custom scroll effects' },
      { name: 'Native mobile app development', description: 'iOS/Android native apps or React Native/Flutter development' },
      { name: 'Email marketing setup', description: 'Email templates, automation workflows, or newsletter configuration' },
    ],
    averageRate: { low: 75, median: 125, high: 250 },
  },
  'graphic-design': {
    name: 'Graphic Design',
    type: 'graphic-design',
    label: 'Graphic Design',
    icon: '🎨',
    scopeItems: [
      { name: 'Creative Brief & Discovery', description: 'Initial consultation to understand brand, goals, and design direction', included: true },
      { name: 'Mood Board & Direction', description: 'Visual mood board with color palettes, typography, and style references', included: true },
      { name: 'Initial Concepts', description: 'Three distinct design concepts based on the approved creative brief', included: true },
      { name: 'Design Revisions', description: 'Up to specified number of revision rounds on the selected concept', included: true },
      { name: 'Final Design Files', description: 'Production-ready files in specified formats (PDF, PNG, JPG, etc.)', included: true },
      { name: 'Source Files', description: 'Editable source files (AI, PSD, FIGMA, etc.) delivered to client', included: false },
      { name: 'Brand Guidelines Document', description: 'Comprehensive brand style guide with usage rules and specifications', included: false },
      { name: 'Print Preparation', description: 'Print-ready file preparation with bleed, CMYK conversion, and prepress checks', included: true },
      { name: 'Social Media Adaptations', description: 'Design adapted for specified social media platform dimensions', included: false },
      { name: 'Icon/Illustration Set', description: 'Custom icons or illustrations as specified in scope', included: false },
      { name: 'Presentation Design', description: 'Branded presentation template with master slides and layouts', included: false },
    ],
    exclusions: [
      { name: 'Stock photography licensing', description: 'Purchase of stock photos, illustrations, or premium fonts' },
      { name: 'Printing costs', description: 'Physical printing, paper costs, or print vendor management' },
      { name: 'Unlimited revisions', description: 'Revisions beyond the specified number require a change order' },
      { name: 'Copywriting', description: 'Writing, editing, or proofreading of any text content' },
      { name: 'Motion graphics', description: 'Animated versions of static designs or video content' },
    ],
    averageRate: { low: 50, median: 100, high: 200 },
  },
  'marketing': {
    name: 'Marketing & Content',
    type: 'marketing',
    label: 'Marketing & Content',
    icon: '📣',
    scopeItems: [
      { name: 'Marketing Strategy', description: 'Comprehensive marketing strategy document with goals, KPIs, and channels', included: true },
      { name: 'Content Calendar', description: 'Monthly content calendar with topics, channels, and publishing schedule', included: true },
      { name: 'Blog Posts', description: 'SEO-optimized blog posts of specified word count and quantity per month', included: true },
      { name: 'Social Media Posts', description: 'Specified number of social media posts per week with copy and hashtags', included: true },
      { name: 'Email Campaigns', description: 'Email newsletter design, copywriting, and campaign setup', included: true },
      { name: 'SEO Audit & Strategy', description: 'Technical SEO audit, keyword research, and optimization roadmap', included: false },
      { name: 'Paid Ad Campaign Setup', description: 'Campaign setup for specified platforms (Google, Meta, LinkedIn)', included: false },
      { name: 'Analytics & Reporting', description: 'Monthly analytics reports with KPI tracking and recommendations', included: true },
      { name: 'Competitor Analysis', description: 'Detailed competitor landscape analysis with positioning recommendations', included: true },
      { name: 'Landing Page Copy', description: 'Conversion-focused copy for specified landing pages', included: false },
      { name: 'Brand Voice Guide', description: 'Documented brand voice, tone, and messaging guidelines', included: false },
    ],
    exclusions: [
      { name: 'Ad spend budget', description: 'Actual advertising spend on any platform is separate from service fees' },
      { name: 'Graphic design', description: 'Custom graphics, video production, or photography' },
      { name: 'Website development', description: 'Any coding, development, or CMS modifications' },
      { name: 'PR and media outreach', description: 'Press release distribution or journalist relationship management' },
      { name: 'Event marketing', description: 'Event planning, coordination, or on-site marketing activities' },
    ],
    averageRate: { low: 60, median: 110, high: 200 },
  },
  'consulting': {
    name: 'Consulting',
    type: 'consulting',
    label: 'Consulting',
    icon: '🧠',
    scopeItems: [
      { name: 'Discovery & Assessment', description: 'Initial assessment of current state, challenges, and opportunities', included: true },
      { name: 'Stakeholder Interviews', description: 'Structured interviews with key stakeholders to gather insights', included: true },
      { name: 'Research & Analysis', description: 'Market research, data analysis, and benchmarking against industry standards', included: true },
      { name: 'Strategy Document', description: 'Comprehensive strategy document with findings and recommendations', included: true },
      { name: 'Recommendations Report', description: 'Prioritized action items with effort/impact assessment', included: true },
      { name: 'Presentation to Leadership', description: 'Executive presentation of findings and recommendations', included: true },
      { name: 'Implementation Roadmap', description: 'Phased implementation plan with timelines and resource requirements', included: true },
      { name: 'Implementation Support', description: 'Hands-on support during implementation of recommendations', included: false },
      { name: 'Training & Workshops', description: 'Team training sessions or workshops on recommended practices', included: false },
      { name: 'Monthly Advisory Calls', description: 'Ongoing advisory calls for specified duration post-engagement', included: false },
    ],
    exclusions: [
      { name: 'Implementation execution', description: 'Actually executing recommended changes (unless explicitly in scope)' },
      { name: 'Hiring or staffing', description: 'Recruiting, interviewing, or hiring team members' },
      { name: 'Legal or financial advice', description: 'Legal counsel, tax advice, or financial planning' },
      { name: 'Technology procurement', description: 'Purchasing software, hardware, or infrastructure' },
    ],
    averageRate: { low: 100, median: 200, high: 400 },
  },
  'video-production': {
    name: 'Video Production',
    type: 'video-production',
    label: 'Video Production',
    icon: '🎬',
    scopeItems: [
      { name: 'Creative Brief & Concept', description: 'Video concept development, creative direction, and storyboard approval', included: true },
      { name: 'Script Writing', description: 'Complete script with dialogue, narration, and shot descriptions', included: true },
      { name: 'Storyboarding', description: 'Visual storyboard illustrating key scenes and camera angles', included: true },
      { name: 'Pre-Production Planning', description: 'Location scouting, talent coordination, equipment planning, and scheduling', included: true },
      { name: 'Filming / Production', description: 'On-location or studio filming with specified crew and equipment', included: true },
      { name: 'Video Editing', description: 'Professional editing including cuts, transitions, pacing, and color grading', included: true },
      { name: 'Music & Sound Design', description: 'Royalty-free music selection and basic sound design/mixing', included: true },
      { name: 'Motion Graphics', description: 'Animated titles, lower thirds, and branded graphic overlays', included: true },
      { name: 'Revision Rounds', description: 'Specified number of revision rounds on the edited video', included: true },
      { name: 'Final Delivery', description: 'Final video files in specified formats and resolutions', included: true },
      { name: 'Raw Footage Delivery', description: 'Delivery of all raw, unedited footage to client', included: false },
      { name: 'Social Media Cuts', description: 'Short-form edits optimized for social media platforms', included: false },
      { name: 'Thumbnail Design', description: 'Custom thumbnail design for video hosting platforms', included: false },
    ],
    exclusions: [
      { name: 'Talent fees', description: 'Actor, model, or voiceover artist compensation' },
      { name: 'Location rental fees', description: 'Venue or studio rental costs' },
      { name: 'Licensed music', description: 'Premium or recognizable licensed music tracks' },
      { name: 'Drone footage', description: 'Aerial videography or drone operation' },
      { name: 'Live streaming', description: 'Live broadcast setup or streaming services' },
    ],
    averageRate: { low: 100, median: 175, high: 350 },
  },
  'photography': {
    name: 'Photography',
    type: 'photography',
    label: 'Photography',
    icon: '📷',
    scopeItems: [
      { name: 'Pre-Shoot Planning', description: 'Concept discussion, shot list creation, and location/timing planning', included: true },
      { name: 'On-Location Shooting', description: 'Professional photography session at specified location and duration', included: true },
      { name: 'Photo Selection', description: 'Curated selection of best images from the shoot for client review', included: true },
      { name: 'Basic Editing & Retouching', description: 'Color correction, exposure adjustment, and basic retouching on selected images', included: true },
      { name: 'Advanced Retouching', description: 'Detailed retouching including skin smoothing, object removal, compositing', included: false },
      { name: 'Final Delivery', description: 'High-resolution images delivered digitally in specified formats', included: true },
      { name: 'Print-Ready Files', description: 'Files prepared for print with proper color profiles and resolution', included: false },
      { name: 'Web-Optimized Files', description: 'Resized and compressed versions optimized for web use', included: true },
      { name: 'Usage Rights Documentation', description: 'Clear documentation of image usage rights and licensing terms', included: true },
      { name: 'Raw Files', description: 'Delivery of unedited RAW format files from the shoot', included: false },
    ],
    exclusions: [
      { name: 'Travel beyond local area', description: 'Travel costs for shoots outside the specified local area' },
      { name: 'Props and styling', description: 'Purchase of props, wardrobe, or professional styling services' },
      { name: 'Hair and makeup', description: 'Professional hair and makeup artist services' },
      { name: 'Extended licensing', description: 'Usage rights beyond the specified license terms' },
      { name: 'Physical prints', description: 'Printing, framing, or physical product creation' },
    ],
    averageRate: { low: 75, median: 150, high: 300 },
  },
  'writing': {
    name: 'Writing & Copywriting',
    type: 'writing',
    label: 'Writing & Copywriting',
    icon: '✍️',
    scopeItems: [
      { name: 'Research & Discovery', description: 'Topic research, audience analysis, and competitive content review', included: true },
      { name: 'Content Outline', description: 'Detailed outline with headlines, sections, and key points for approval', included: true },
      { name: 'First Draft', description: 'Complete first draft based on approved outline and brief', included: true },
      { name: 'Revision Rounds', description: 'Specified number of revision rounds based on client feedback', included: true },
      { name: 'Final Polish & Proofread', description: 'Final proofreading, fact-checking, and formatting', included: true },
      { name: 'SEO Optimization', description: 'Keyword integration, meta descriptions, and SEO-friendly structure', included: false },
      { name: 'Tone & Voice Development', description: 'Brand voice guide and consistent tone across all deliverables', included: false },
      { name: 'Interview-Based Content', description: 'Subject matter expert interviews to inform content', included: false },
      { name: 'Content Formatting', description: 'Formatting for specified platform (blog, email, social, print)', included: true },
      { name: 'Image Sourcing', description: 'Selection of relevant stock images or image direction for designers', included: false },
    ],
    exclusions: [
      { name: 'Design and layout', description: 'Visual design, page layout, or graphic creation' },
      { name: 'CMS uploading', description: 'Publishing content to websites or CMS platforms' },
      { name: 'Stock photo licensing', description: 'Purchase of stock photography or illustrations' },
      { name: 'Translation', description: 'Translation or localization into other languages' },
      { name: 'Ongoing content management', description: 'Recurring content updates or editorial calendar management' },
    ],
    averageRate: { low: 40, median: 85, high: 175 },
  },
  'custom': {
    name: 'Custom Project',
    type: 'custom',
    label: 'Custom',
    icon: '⚡',
    scopeItems: [
      { name: 'Discovery & Scoping', description: 'Initial project scoping and requirements documentation', included: true },
      { name: 'Deliverable 1', description: 'Define your first deliverable', included: true },
      { name: 'Deliverable 2', description: 'Define your second deliverable', included: true },
      { name: 'Review & Revision', description: 'Client review period with specified revision rounds', included: true },
      { name: 'Final Delivery', description: 'Final deliverables in agreed format', included: true },
    ],
    exclusions: [
      { name: 'Out-of-scope requests', description: 'Any work not explicitly listed in the scope above' },
      { name: 'Ongoing support', description: 'Post-delivery maintenance or support' },
    ],
    averageRate: { low: 50, median: 100, high: 250 },
  },
}

export function getTemplateItems(type: ProjectType): { scopeItems: ScopeItem[]; exclusions: Exclusion[] } {
  const template = PROJECT_TEMPLATES[type]
  return {
    scopeItems: template.scopeItems.map(item => ({ ...item, id: makeId() })),
    exclusions: template.exclusions.map(item => ({ ...item, id: makeId() })),
  }
}

export function getDefaultMilestones(pricingType: string, totalValue: number): Milestone[] {
  if (pricingType === 'hourly') return []
  if (pricingType === 'retainer') {
    return [
      { id: makeId(), name: 'Monthly Retainer Payment', percentage: 100, description: 'Due at the beginning of each month' },
    ]
  }
  return [
    { id: makeId(), name: 'Project Kickoff', percentage: 30, description: 'Due upon contract signing before work begins' },
    { id: makeId(), name: 'Midpoint Delivery', percentage: 30, description: 'Due upon approval of midpoint deliverables' },
    { id: makeId(), name: 'Final Delivery', percentage: 40, description: 'Due upon delivery of all final deliverables' },
  ]
}
