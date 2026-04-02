'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame,
  AlertCircle,
  CheckCircle2,
  Copy,
  RotateCcw,
  ChevronRight,
  TrendingUp,
  Eye,
  MousePointer,
  MessageSquare,
  Target,
} from 'lucide-react'

type Stage = 'idle' | 'analyzing' | 'results'

const ANALYZE_STEPS = [
  'Scanning headline clarity...',
  'Checking value proposition...',
  'Analyzing CTA strength...',
  'Measuring trust signals...',
  'Computing brutality score...',
]

const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce',
  'Agency / Services',
  'Creator Tools',
  'B2B Platform',
  'Marketplace',
  'Mobile App',
  'Other',
]

const ALL_TAGS = [
  'Weak CTA',
  'Generic Copy',
  'No Social Proof',
  'Confusing Hero',
  'Zero Urgency',
  'Feature Overload',
  'Buried Value Prop',
  'Slow Load Feel',
  'No Clear Audience',
  'Weak Headline',
]

const ALL_ISSUES = [
  {
    icon: MessageSquare,
    title: 'Weak Opening Line',
    desc: "Your hero headline leads with features, not outcomes. Nobody cares what your product does — they care what it does for them. 'Project management software' is a category, not a promise.",
    severity: 'high',
  },
  {
    icon: MousePointer,
    title: 'CTA Confusion',
    desc: "You have competing calls-to-action fighting for attention. Users hit decision paralysis and leave. One primary CTA beats three every single time.",
    severity: 'high',
  },
  {
    icon: Eye,
    title: 'No Trust Above the Fold',
    desc: "You're asking strangers to act before giving them any reason to believe you. Trust is built in the first 5 seconds. Social proof, logos, or a usage number belong above the fold.",
    severity: 'high',
  },
  {
    icon: Target,
    title: 'Feature-First, Not Outcome-First',
    desc: "Every section describes what the product does. None of it speaks to the transformation. Users buy outcomes. Reframe everything around the 'after state'.",
    severity: 'medium',
  },
  {
    icon: TrendingUp,
    title: 'Missing Urgency Layer',
    desc: "Your page gives zero reason to act today versus next Tuesday. Urgency doesn't have to be fake countdown timers. Quantify the cost of inaction instead.",
    severity: 'medium',
  },
]

const ALL_FIXES = [
  {
    title: 'Rewrite Your Headline',
    desc: "Lead with the outcome. Instead of 'Project management software', try 'Ship features 3x faster without the 9am standups'. Put the transformation in the H1.",
    example: '"Ship faster. Meet less." vs "Collaborative project management platform"',
  },
  {
    title: 'One CTA, Everywhere',
    desc: "Pick one primary action and repeat it. Make it specific: 'Start Free Trial' beats 'Get Started' by ~30% in most tests. Remove all secondary CTAs from the hero.",
    example: '"Start your free trial" repeated 3x > 5 different buttons',
  },
  {
    title: 'Add a Trust Strip Below the Hero',
    desc: "Drop a 5-logo strip immediately after the headline. Even 'Used by 200+ founders' outperforms nothing. If you have testimonials, one quote with a face crushes paragraphs of copy.",
    example: '"Trusted by teams at Notion, Linear, Vercel..."',
  },
  {
    title: 'Open With the Problem',
    desc: "Your first sentence should hit the pain, not describe the product. 'Tired of losing deals because your proposal arrived 2 days late?' hooks faster than any feature list.",
    example: '"Tired of [pain]?" > "Introducing [product]"',
  },
]

function generateScore(productName: string, description: string): number {
  const seed = productName.length * 7 + description.length * 3
  return 22 + (seed % 52)
}

function getTagsForScore(score: number): string[] {
  if (score < 35) return ALL_TAGS.slice(0, 6)
  if (score < 55) return ALL_TAGS.slice(0, 4)
  return ALL_TAGS.slice(0, 2)
}

function getScoreColor(score: number) {
  if (score < 40) return { text: '#ef4444', glow: 'rgba(239,68,68,0.3)', label: 'Needs Serious Work' }
  if (score < 60) return { text: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'Room to Improve' }
  return { text: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Decent Start' }
}

export default function AiRoastPage() {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [copied, setCopied] = useState<number | null>(null)

  const canSubmit = productName.trim().length > 0 && description.trim().length > 10

  const handleSubmit = () => {
    if (!canSubmit) return
    const score = generateScore(productName, description)
    setFinalScore(score)
    setStage('analyzing')
    setStepIndex(0)
  }

  useEffect(() => {
    if (stage !== 'analyzing') return
    if (stepIndex < ANALYZE_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), 550)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setStage('results')
        animateScore(finalScore)
      }, 700)
      return () => clearTimeout(t)
    }
  }, [stage, stepIndex, finalScore])

  function animateScore(target: number) {
    let current = 0
    const step = Math.ceil(target / 40)
    const interval = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayScore(current)
      if (current >= target) clearInterval(interval)
    }, 25)
  }

  const handleReset = () => {
    setStage('idle')
    setProductName('')
    setDescription('')
    setIndustry('')
    setDisplayScore(0)
    setStepIndex(0)
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 1800)
  }

  const scoreInfo = getScoreColor(finalScore)
  const tags = getTagsForScore(finalScore)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#07070f' }}>
      <div className="absolute inset-0 dot-grid-bg opacity-50 pointer-events-none" />
      <div className="section-glow-red absolute inset-0 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-5 pt-16 pb-24">
        {/* Hero */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="badge mb-5 inline-block"
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <Flame size={11} className="inline mr-1" />
            AI Design Critic
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Your Landing Page{' '}
            <span style={{ color: '#ef4444' }}>Probably Sucks.</span>
            <br />
            Let&apos;s Confirm That.
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Paste your product info below. Get a brutally honest AI critique with
            a real score and fixes you can use today.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {[
              { label: '12,400+ pages roasted' },
              { label: 'Average score: 49/100' },
              { label: 'Avg fix time: 2 hours' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                }}
              >
                {stat.label}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'idle' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="glass-card p-8"
            >
              <div className="space-y-5">
                <div>
                  <label className="label-text">Product Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Notion, Stripe, your SaaS name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-text">
                    What does your product do? (1–2 sentences)
                  </label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="e.g. We help freelancers send professional proposals and get paid faster..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-text">Industry</label>
                  <select
                    className="input-field"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select an industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} style={{ background: '#1a1a2e' }}>{ind}</option>
                    ))}
                  </select>
                </div>

                <motion.button
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: canSubmit ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'rgba(255,255,255,0.06)',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    opacity: canSubmit ? 1 : 0.4,
                  }}
                  onClick={handleSubmit}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                >
                  <Flame size={18} />
                  Roast My Page
                </motion.button>
                {!canSubmit && (
                  <p className="text-center text-xs text-slate-600">Fill in product name and description to continue</p>
                )}
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="glass-card p-12 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="4" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 154" />
                </svg>
                <Flame size={24} className="absolute inset-0 m-auto" style={{ color: '#ef4444' }} />
              </div>

              <div className="h-6 mb-3">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-white font-medium text-base"
                  >
                    {ANALYZE_STEPS[stepIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-1.5 mt-6">
                {ANALYZE_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i <= stepIndex ? '#ef4444' : 'rgba(255,255,255,0.15)',
                      transform: i === stepIndex ? 'scale(1.4)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
              <p className="text-slate-600 text-xs mt-6">Analyzing &ldquo;{productName}&rdquo;...</p>
            </motion.div>
          )}

          {stage === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
              {/* Score Card */}
              <div className="glass-card p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${scoreInfo.text} 0%, transparent 70%)` }} />
                <p className="text-slate-400 text-sm mb-3 uppercase tracking-widest font-medium">Roast Score</p>
                <motion.div className="text-8xl font-black mb-1" style={{ color: scoreInfo.text, textShadow: `0 0 40px ${scoreInfo.glow}` }}>
                  {displayScore}
                </motion.div>
                <p className="text-slate-500 text-sm">/100 · {scoreInfo.label}</p>
                <p className="text-slate-300 mt-4 text-sm max-w-xs mx-auto">
                  {finalScore < 40
                    ? 'This page is actively losing you customers. The good news: every issue is fixable.'
                    : finalScore < 60
                    ? "Not terrible, but not converting either. A few targeted fixes could double your results."
                    : "Solid foundation. Some sharp edges that are costing you conversions though."}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Issues */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} style={{ color: '#ef4444' }} />
                  What&apos;s Broken
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ALL_ISSUES.slice(0, finalScore < 40 ? 5 : finalScore < 60 ? 4 : 3).map((issue, i) => {
                    const IssueIcon = issue.icon
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="glass-card p-5" style={{ borderColor: issue.severity === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: issue.severity === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)' }}>
                            <IssueIcon size={14} style={{ color: issue.severity === 'high' ? '#ef4444' : '#f59e0b' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-semibold text-sm">{issue.title}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: issue.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: issue.severity === 'high' ? '#fca5a5' : '#fcd34d' }}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">{issue.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Fixes */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  How to Fix It
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ALL_FIXES.map((fix, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.2 }} className="glass-card p-5 relative" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                      <button className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors" onClick={() => handleCopy(i, fix.title + ': ' + fix.desc)}>
                        {copied === i ? <CheckCircle2 size={13} style={{ color: '#10b981' }} /> : <Copy size={13} style={{ color: '#475569' }} />}
                      </button>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mb-3 text-xs font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>
                        {i + 1}
                      </div>
                      <p className="text-white font-semibold text-sm mb-1.5">{fix.title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed mb-2">{fix.desc}</p>
                      <div className="text-xs px-3 py-2 rounded-lg font-mono" style={{ background: 'rgba(16,185,129,0.07)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.12)' }}>
                        {fix.example}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Before / After */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Headline Rewrite</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="glass-card p-5" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md mb-3 inline-block" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>❌ Before</span>
                    <p className="text-slate-300 text-sm font-medium">&ldquo;{productName} — The best tool for {industry || 'your business'}&rdquo;</p>
                    <p className="text-slate-600 text-xs mt-2">Generic. No outcome. No hook.</p>
                  </div>
                  <div className="glass-card p-5" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md mb-3 inline-block" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>✅ After</span>
                    <p className="text-white text-sm font-semibold">&ldquo;{productName}: Stop losing customers to a page that doesn&apos;t convert.&rdquo;</p>
                    <p className="text-slate-500 text-xs mt-2">Outcome-first. Pain-aware. Clickable.</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="glass-card p-8 text-center" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
                <p className="text-white font-bold text-xl mb-2">Ready to actually fix this?</p>
                <p className="text-slate-400 text-sm mb-6">You have the problems and the fixes. The page won&apos;t rewrite itself.</p>
                <button onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <RotateCcw size={14} />
                  Roast Another Page
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
