'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  Check,
  Star,
} from 'lucide-react'

type Stage = 'idle' | 'analyzing' | 'results'

const PRODUCT_TYPES = ['SaaS / Software', 'E-commerce', 'Agency / Services', 'Marketplace', 'Creator Tools', 'Mobile App', 'Other']
const PRICING_MODELS = ['Monthly subscription', 'Annual subscription', 'One-time purchase', 'Freemium + paid', 'Usage-based', 'Custom / enterprise']
const TIER_COUNTS = ['1 tier (single price)', '2 tiers', '3 tiers', '4 tiers', '5+ tiers']

const ANALYZE_STEPS = [
  'Scanning tier structure...',
  'Checking price anchoring...',
  'Analyzing feature positioning...',
  'Measuring upgrade friction...',
  'Generating recommendations...',
]

function getPricingScore(tierCount: string, model: string, annualDiscount: boolean, price: string): number {
  let score = 60
  if (tierCount === '3 tiers') score += 15
  if (tierCount === '2 tiers') score += 8
  if (tierCount === '4 tiers') score -= 5
  if (tierCount === '5+ tiers') score -= 15
  if (tierCount === '1 tier (single price)') score -= 10
  if (model.includes('Monthly') || model.includes('Annual')) score += 10
  if (annualDiscount) score += 8
  const p = parseFloat(price)
  if (!isNaN(p) && p > 0 && p < 500) score += 5
  return Math.min(95, Math.max(18, score))
}

function getScoreColor(score: number) {
  if (score < 40) return { color: '#ef4444', glow: 'rgba(239,68,68,0.3)', label: 'Losing Revenue' }
  if (score < 65) return { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'Needs Work' }
  return { color: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Good Foundation' }
}

interface PricingTier {
  name: string
  price: number
  annualPrice: number
  badge?: string
  features: string[]
  cta: string
  highlighted: boolean
}

function generatePricingTiers(basePrice: string, model: string): PricingTier[] {
  const base = parseFloat(basePrice) || 29
  return [
    {
      name: 'Starter',
      price: Math.round(base * 0.5),
      annualPrice: Math.round(base * 0.5 * 10),
      features: ['Up to 3 projects', '5GB storage', 'Email support', 'Basic analytics', 'API access'],
      cta: 'Start free trial',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: base,
      annualPrice: Math.round(base * 10),
      badge: 'Most Popular',
      features: ['Unlimited projects', '50GB storage', 'Priority support', 'Advanced analytics', 'API access', 'Custom integrations', 'Team collaboration'],
      cta: 'Start free trial',
      highlighted: true,
    },
    {
      name: 'Scale',
      price: Math.round(base * 2.5),
      annualPrice: Math.round(base * 2.5 * 10),
      features: ['Everything in Pro', 'Unlimited storage', 'Dedicated support', 'SLA guarantee', 'SSO / SAML', 'Custom contracts', 'Onboarding call'],
      cta: 'Contact sales',
      highlighted: false,
    },
  ]
}

export default function PricingCriticPage() {
  const [productType, setProductType] = useState('')
  const [pricingModel, setPricingModel] = useState('')
  const [price, setPrice] = useState('')
  const [tierCount, setTierCount] = useState('')
  const [annualDiscount, setAnnualDiscount] = useState(false)
  const [stage, setStage] = useState<Stage>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const canSubmit = productType && pricingModel && tierCount

  const handleSubmit = () => {
    if (!canSubmit) return
    const score = getPricingScore(tierCount, pricingModel, annualDiscount, price)
    setFinalScore(score)
    setPricingTiers(generatePricingTiers(price, pricingModel))
    setStage('analyzing')
    setStepIndex(0)
  }

  useEffect(() => {
    if (stage !== 'analyzing') return
    if (stepIndex < ANALYZE_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), 500)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setStage('results')
        let c = 0
        const interval = setInterval(() => {
          c = Math.min(c + 2, finalScore)
          setDisplayScore(c)
          if (c >= finalScore) clearInterval(interval)
        }, 20)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [stage, stepIndex, finalScore])

  const handleReset = () => {
    setStage('idle')
    setProductType('')
    setPricingModel('')
    setPrice('')
    setTierCount('')
    setAnnualDiscount(false)
    setDisplayScore(0)
    setStepIndex(0)
  }

  const scoreInfo = getScoreColor(finalScore)

  const issues = [
    tierCount.includes('4') || tierCount.includes('5+')
      ? { title: 'Too Many Tiers → Analysis Paralysis', desc: "With 4+ tiers, users enter decision paralysis and bounce. The sweet spot is 3 tiers with one clearly highlighted as the 'popular' choice.", severity: 'high' }
      : null,
    tierCount === '1 tier (single price)'
      ? { title: 'Single Tier Kills Expansion Revenue', desc: "One price means every customer pays the same. You're leaving upgrade revenue and enterprise deals on the table. Add a Pro and Scale tier.", severity: 'high' }
      : null,
    !annualDiscount
      ? { title: 'No Annual Plan = Cash Flow Leak', desc: "Annual plans give you upfront cash and 30-40% lower churn. If you're not offering them, you're losing to competitors who do.", severity: 'medium' }
      : null,
    !price || parseFloat(price) < 10
      ? { title: 'Price Point May Be Too Low', desc: "Low prices signal low value and attract price-sensitive users who churn fast. Enterprise buyers often interpret a $9/mo price as 'not serious'.", severity: 'medium' }
      : null,
    { title: 'Feature List Overload on Pricing Page', desc: "Long feature lists cause users to compare rows instead of feeling the value. Lead with outcomes ('Ship 3x faster') not features ('Unlimited projects').", severity: 'low' },
  ].filter(Boolean).slice(0, 4)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#07070f' }}>
      <div className="absolute inset-0 dot-grid-bg opacity-50 pointer-events-none" />
      <div className="section-glow-green absolute inset-0 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-5 pt-28 pb-24">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span
            className="badge mb-5 inline-block"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <DollarSign size={11} className="inline mr-1" />
            Pricing Audit
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Your Pricing Page Might Be{' '}
            <span style={{ color: '#10b981' }}>Quietly Killing</span> Sales
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Tell us about your pricing structure. We&apos;ll show you exactly where you&apos;re
            leaving money on the table.
          </p>

          <div className="flex items-center justify-center gap-5 mt-7 flex-wrap">
            {[
              { label: '#1 issue: Too many tiers' },
              { label: 'Avg conversion lift after fix: 23%' },
              { label: '$10M+ in pricing reviewed' },
            ].map((s, i) => (
              <div key={i} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                {s.label}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'idle' && (
            <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="glass-card p-8">
              <div className="space-y-5">
                <div>
                  <label className="label-text">Product Type</label>
                  <select className="input-field" value={productType} onChange={(e) => setProductType(e.target.value)} style={{ cursor: 'pointer' }}>
                    <option value="" disabled>Select type</option>
                    {PRODUCT_TYPES.map((t) => <option key={t} value={t} style={{ background: '#1a1a2e' }}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label-text">Current Pricing Model</label>
                  <select className="input-field" value={pricingModel} onChange={(e) => setPricingModel(e.target.value)} style={{ cursor: 'pointer' }}>
                    <option value="" disabled>Select model</option>
                    {PRICING_MODELS.map((m) => <option key={m} value={m} style={{ background: '#1a1a2e' }}>{m}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Starting Price ($/mo)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <input
                        className="input-field pl-8"
                        type="number"
                        placeholder="e.g. 29"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Number of Tiers</label>
                    <select className="input-field" value={tierCount} onChange={(e) => setTierCount(e.target.value)} style={{ cursor: 'pointer' }}>
                      <option value="" disabled>Select</option>
                      {TIER_COUNTS.map((t) => <option key={t} value={t} style={{ background: '#1a1a2e' }}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                    style={{
                      background: annualDiscount ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)',
                      border: annualDiscount ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.12)',
                    }}
                    onClick={() => setAnnualDiscount(!annualDiscount)}
                  >
                    {annualDiscount && <Check size={12} style={{ color: '#10b981' }} />}
                  </div>
                  <span className="text-sm text-slate-300">I offer an annual pricing discount</span>
                </label>

                <motion.button
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                  style={{
                    background: canSubmit ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    opacity: canSubmit ? 1 : 0.4,
                  }}
                  onClick={handleSubmit}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                >
                  <DollarSign size={18} />
                  Audit My Pricing
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="4" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 154" />
                </svg>
                <DollarSign size={22} className="absolute inset-0 m-auto" style={{ color: '#10b981' }} />
              </div>
              <div className="h-6 mb-3">
                <AnimatePresence mode="wait">
                  <motion.p key={stepIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-white font-medium">
                    {ANALYZE_STEPS[stepIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex justify-center gap-1.5 mt-6">
                {ANALYZE_STEPS.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ background: i <= stepIndex ? '#10b981' : 'rgba(255,255,255,0.15)', transform: i === stepIndex ? 'scale(1.5)' : 'scale(1)' }} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Score */}
              <div className="glass-card p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 50% 100%, ${scoreInfo.glow} 0%, transparent 70%)` }} />
                <p className="text-slate-500 text-sm uppercase tracking-widest mb-3">Pricing Score</p>
                <div className="text-8xl font-black mb-1" style={{ color: scoreInfo.color, textShadow: `0 0 40px ${scoreInfo.glow}` }}>
                  {displayScore}
                </div>
                <p className="text-slate-500 text-sm">/100 · {scoreInfo.label}</p>
              </div>

              {/* Issues */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
                  Issues Found
                </h3>
                <div className="space-y-3">
                  {issues.map((issue, i) => issue && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card p-5"
                      style={{ borderColor: issue.severity === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0 mt-0.5"
                          style={{
                            background: issue.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: issue.severity === 'high' ? '#fca5a5' : '#fcd34d',
                          }}
                        >
                          {issue.severity}
                        </span>
                        <div>
                          <p className="text-white font-semibold text-sm mb-1">{issue.title}</p>
                          <p className="text-slate-400 text-xs leading-relaxed">{issue.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested pricing structure */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <TrendingUp size={18} style={{ color: '#10b981' }} />
                    Suggested Structure
                  </h3>
                  {/* Monthly / Annual toggle */}
                  <div
                    className="flex p-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {(['monthly', 'annual'] as const).map((cycle) => (
                      <button
                        key={cycle}
                        onClick={() => setBillingCycle(cycle)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize"
                        style={{
                          background: billingCycle === cycle ? 'rgba(16,185,129,0.25)' : 'transparent',
                          color: billingCycle === cycle ? '#6ee7b7' : '#94a3b8',
                        }}
                      >
                        {cycle}
                        {cycle === 'annual' && <span className="ml-1 text-xs" style={{ color: '#10b981' }}>-17%</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {pricingTiers.map((tier, i) => (
                    <motion.div
                      key={tier.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-5 flex flex-col relative"
                      style={{
                        background: tier.highlighted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                        border: tier.highlighted ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {tier.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
                          >
                            <Star size={10} fill="currentColor" />
                            {tier.badge}
                          </span>
                        </div>
                      )}
                      <p className="text-slate-400 text-sm font-medium mb-1">{tier.name}</p>
                      <div className="mb-4">
                        <span className="text-3xl font-black text-white">
                          ${billingCycle === 'annual' ? tier.annualPrice : tier.price}
                        </span>
                        <span className="text-slate-500 text-sm">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                      </div>
                      <ul className="space-y-2 flex-1 mb-5">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check size={12} style={{ color: tier.highlighted ? '#10b981' : '#475569', flexShrink: 0 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: tier.highlighted ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.07)',
                          color: tier.highlighted ? '#fff' : '#94a3b8',
                          border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {tier.cta}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="glass-card p-6 text-center" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                <CheckCircle2 size={20} style={{ color: '#10b981' }} className="mx-auto mb-3" />
                <p className="text-white font-bold mb-1">Estimated Conversion Impact</p>
                <p className="text-slate-400 text-sm">
                  Implementing these structural fixes could lift your pricing page conversion by{' '}
                  <span style={{ color: '#10b981' }} className="font-semibold">18–31%</span> based on
                  comparable SaaS audits.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <RotateCcw size={14} />
                Audit Another Product
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
