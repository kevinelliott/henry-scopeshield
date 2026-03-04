import Link from 'next/link'

const INTELLIGENCE_LAYERS = [
  {
    icon: '📊',
    title: 'Scope Completeness Score',
    description: 'Get an A-F grade (0-100) on your SOW based on sections covered, specificity, and protections included.',
  },
  {
    icon: '🔍',
    title: 'Creep Risk Analysis',
    description: 'AI scans for vague language like "as needed" and "ongoing support" — flags each instance with a rewrite suggestion.',
  },
  {
    icon: '📋',
    title: 'Missing Section Detection',
    description: 'Compares your SOW against best-practice templates and flags missing sections before your client spots them.',
  },
  {
    icon: '💰',
    title: 'Rate Benchmarking',
    description: 'See where your rate falls against market data for your project type. Low, median, and high with visual positioning.',
  },
  {
    icon: '📝',
    title: 'Change Order Templates',
    description: 'Auto-generate change request forms that reference your original SOW scope. Professional, fast, no ambiguity.',
  },
  {
    icon: '🏦',
    title: 'Milestone Calculator',
    description: 'Smart payment schedule suggestions based on project size. Never start work without upfront payment again.',
  },
]

const COMPETITORS = [
  { name: 'ScopeShield', price: '$12/mo', features: ['SOW-specific builder', 'Scope creep intelligence', 'Vague language detection', 'Rate benchmarking', 'Change order templates', 'Milestone calculator'], highlight: true },
  { name: 'Qwilr', price: '$35/mo', features: ['General proposals', 'No scope intelligence', 'No creep protection', 'No exclusions focus', 'No rate benchmarking', 'General templates'] },
  { name: 'PandaDoc', price: '$19/mo', features: ['General documents', 'No scope intelligence', 'No creep protection', 'No exclusions focus', 'No rate benchmarking', 'General templates'] },
  { name: 'Bonsai', price: '$17/mo', features: ['All-in-one bloat', 'Basic contracts only', 'No creep protection', 'No vague language scan', 'No rate benchmarking', 'Generic templates'] },
  { name: 'Google Docs', price: 'Free', features: ['No templates', 'No intelligence', 'No protection', 'No exclusions', 'No benchmarking', 'Copy-paste everything'] },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with scope protection',
    features: ['3 SOWs', 'All intelligence layers', 'Print-ready documents', 'Pre-loaded templates'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious freelancers',
    features: ['Unlimited SOWs', 'All intelligence layers', 'Change order templates', 'Rate benchmarking', 'Priority support', 'Custom branding (coming soon)'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$29',
    period: '/month',
    description: 'For teams and agencies',
    features: ['Everything in Pro', 'Team collaboration', 'Client portal (coming soon)', 'White-label documents', 'API access (coming soon)', 'Dedicated support'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const TESTIMONIALS = [
  {
    quote: "I was losing $5-10K per project to scope creep. ScopeShield's exclusion templates alone saved my first engagement.",
    name: 'Sarah Chen',
    role: 'Freelance Web Developer',
    avatar: 'SC',
  },
  {
    quote: "The vague language detection caught 8 problematic phrases in my old SOW template. I had no idea how exposed I was.",
    name: 'Marcus Rivera',
    role: 'Design Consultant',
    avatar: 'MR',
  },
  {
    quote: "Finally, a tool built for freelancers. Not a bloated all-in-one suite. Just rock-solid SOWs with real protection.",
    name: 'Emily Taylor',
    role: 'Marketing Strategist',
    avatar: 'ET',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-[var(--navy)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--blue)] rounded-lg flex items-center justify-center font-bold text-sm">S</div>
              <span className="font-bold text-lg">ScopeShield</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">Log In</Link>
              <Link href="/auth/signup" className="text-sm bg-[var(--blue)] px-4 py-2 rounded-lg hover:bg-[var(--blue-dark)] transition-colors">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[var(--navy)] text-white py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-6">
            🛡️ Built for freelancers who are tired of scope creep
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Stop losing money to scope creep.
            <br />
            <span className="text-[var(--blue-light)]">SOWs that actually protect you.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Generate professional Statements of Work with built-in scope creep intelligence, vague language detection, and protective clauses. In minutes, not hours.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup" className="bg-[var(--blue)] text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-[var(--blue-dark)] transition-colors">
              Create Your First Protected SOW — Free
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · 3 free SOWs · All intelligence layers included</p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">Scope creep is costing you thousands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">59 million freelancers in the US. Most lose 10-20% of project revenue to scope creep because their SOWs have gaps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-[var(--danger)] mb-2">62%</div>
              <p className="text-gray-600">of freelancers report scope creep on most projects</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-[var(--danger)] mb-2">$8,400</div>
              <p className="text-gray-600">average annual revenue lost to unprotected scope changes</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl font-bold text-[var(--danger)] mb-2">73%</div>
              <p className="text-gray-600">of freelancer SOWs are missing critical protective sections</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Intelligence Layers */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">Six layers of scope protection intelligence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Not just a template. A system that actively analyzes your SOW and catches problems before they cost you money.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {INTELLIGENCE_LAYERS.map((layer) => (
              <div key={layer.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[var(--blue)]/30 transition-colors">
                <div className="text-3xl mb-3">{layer.icon}</div>
                <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{layer.title}</h3>
                <p className="text-gray-600 text-sm">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">See the difference</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">BEFORE</span>
                <span className="text-sm text-gray-500">Typical freelancer SOW</span>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>✕ &ldquo;Website development with <span className="bg-red-100 px-1 rounded">ongoing support</span>&rdquo;</p>
                <p>✕ &ldquo;Revisions <span className="bg-red-100 px-1 rounded">as needed</span> until client is satisfied&rdquo;</p>
                <p>✕ &ldquo;Design, development, <span className="bg-red-100 px-1 rounded">and other tasks</span>&rdquo;</p>
                <p>✕ No exclusions section</p>
                <p>✕ No kill fee or cancellation clause</p>
                <p>✕ No change request process</p>
                <p className="text-xs text-gray-400 mt-4 pt-4 border-t">Scope Score: <span className="text-red-500 font-bold">F (28/100)</span></p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">AFTER</span>
                <span className="text-sm text-gray-500">ScopeShield SOW</span>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>✓ 12 specific scope items with detailed descriptions</p>
                <p>✓ 6 explicit exclusions protecting your boundaries</p>
                <p>✓ &ldquo;2 rounds of revisions per deliverable&rdquo;</p>
                <p>✓ $75 change request fee documented</p>
                <p>✓ 25% kill fee on remaining value</p>
                <p>✓ IP transfers on final payment</p>
                <p className="text-xs text-gray-400 mt-4 pt-4 border-t">Scope Score: <span className="text-green-500 font-bold">A (94/100)</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">How ScopeShield compares</h2>
            <p className="text-gray-600">Purpose-built for freelancer SOWs — not another generic proposal tool.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Feature</th>
                  {COMPETITORS.map(c => (
                    <th key={c.name} className={`text-center py-3 px-4 ${c.highlight ? 'text-[var(--blue)] font-bold' : 'text-gray-700 font-medium'}`}>
                      {c.name}
                      <br />
                      <span className={`text-xs ${c.highlight ? 'text-[var(--blue)]' : 'text-gray-400'}`}>{c.price}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS[0].features.map((feature, i) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700">{feature}</td>
                    {COMPETITORS.map(c => (
                      <td key={c.name} className="text-center py-3 px-4">
                        {c.highlight ? (
                          <span className="text-green-500 font-medium">✓</span>
                        ) : c.features[i]?.startsWith('No') || c.features[i]?.startsWith('Copy') || c.features[i]?.startsWith('Basic') || c.features[i]?.startsWith('General') || c.features[i]?.startsWith('All-in') || c.features[i]?.startsWith('Generic') ? (
                          <span className="text-gray-300">✕</span>
                        ) : (
                          <span className="text-yellow-500">~</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">Trusted by freelancers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--blue)] text-white flex items-center justify-center text-sm font-medium">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[var(--navy)]">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">Simple, honest pricing</h2>
            <p className="text-gray-600">One SOW can save you thousands. This investment pays for itself on the first project.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 ${
                  plan.highlight
                    ? 'bg-[var(--navy)] text-white shadow-lg scale-105'
                    : 'bg-white shadow-sm border border-gray-100'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs bg-[var(--blue)] text-white px-3 py-1 rounded-full inline-block mb-3">Most Popular</div>
                )}
                <h3 className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-[var(--navy)]'}`}>{plan.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{plan.description}</p>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className={plan.highlight ? 'text-[var(--blue-light)]' : 'text-green-500'}>✓</span>
                      <span className={plan.highlight ? 'text-gray-200' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block text-center py-2.5 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-[var(--blue)] text-white hover:bg-[var(--blue-dark)]'
                      : 'bg-gray-100 text-[var(--navy)] hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[var(--navy)] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Your next SOW should protect you</h2>
          <p className="text-gray-300 mb-8 text-lg">Stop sending vague statements of work that leave you vulnerable. Start with ScopeShield in under 5 minutes.</p>
          <Link href="/auth/signup" className="inline-block bg-[var(--blue)] text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-[var(--blue-dark)] transition-colors">
            Create Your First Protected SOW — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--navy-light)] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--blue)] rounded flex items-center justify-center font-bold text-xs text-white">S</div>
              <span className="font-medium text-white text-sm">ScopeShield</span>
            </div>
            <p className="text-xs">© {new Date().getFullYear()} ScopeShield. Built for freelancers who protect their work.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
