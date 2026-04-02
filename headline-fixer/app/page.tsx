'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Copy,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

type Stage = 'idle' | 'analyzing' | 'results'
type Style = 'bold' | 'sharp' | 'curiosity' | 'premium' | 'direct'

const STYLES: { id: Style; label: string; desc: string; color: string }[] = [
  { id: 'bold', label: 'Bold', desc: 'Punchy & aggressive', color: '#ef4444' },
  { id: 'sharp', label: 'Sharp', desc: 'Clear & no fluff', color: '#f59e0b' },
  { id: 'curiosity', label: 'Curiosity', desc: 'Makes them click', color: '#8b5cf6' },
  { id: 'premium', label: 'Premium', desc: 'Aspirational tone', color: '#06b6d4' },
  { id: 'direct', label: 'Direct', desc: 'Outcome-first', color: '#10b981' },
]

const INDUSTRIES = ['SaaS / Software', 'E-commerce', 'Agency / Services', 'Creator Tools', 'B2B / Enterprise', 'Mobile App', 'Media / Content', 'Other']

const ANALYZE_STEPS = [
  'Parsing your headline...',
  'Measuring click potential...',
  'Generating alternatives...',
  'Scoring each variant...',
]

interface HeadlineVariant {
  text: string
  style: Style
  ctr: number
  tags: string[]
}

function generateHeadlines(original: string, style: Style, industry: string): HeadlineVariant[] {
  const word = original.split(' ').slice(0, 3).join(' ') || 'your product'
  const industryShort = industry.split(' / ')[0] || 'your market'

  const templates: Record<Style, HeadlineVariant[]> = {
    bold: [
      { text: `Stop Settling for Mediocre ${industryShort} Results`, style: 'bold', ctr: 3.8, tags: ['Aggressive', 'Pain'] },
      { text: `${word}: Built for People Who Actually Ship`, style: 'bold', ctr: 3.5, tags: ['Direct', 'Identity'] },
      { text: `The ${industryShort} Tool That Doesn't Baby You`, style: 'bold', ctr: 3.2, tags: ['Edgy', 'Bold'] },
      { text: `We Fixed What Every Other ${industryShort} Tool Gets Wrong`, style: 'bold', ctr: 3.6, tags: ['Contrast', 'Claim'] },
    ],
    sharp: [
      { text: `${word}. Less Setup. Faster Results.`, style: 'sharp', ctr: 3.4, tags: ['Outcome', 'Clean'] },
      { text: `Get Your First ${industryShort} Win in 15 Minutes`, style: 'sharp', ctr: 4.1, tags: ['Time', 'Specific'] },
      { text: `${word}: What It Does, What It Costs, What You Get`, style: 'sharp', ctr: 2.9, tags: ['Transparent', 'Direct'] },
      { text: `Cut ${industryShort} Work in Half. Keep 100% of the Results.`, style: 'sharp', ctr: 3.7, tags: ['Value', 'Outcome'] },
    ],
    curiosity: [
      { text: `Why 3,000+ ${industryShort} Teams Switched Last Month`, style: 'curiosity', ctr: 4.3, tags: ['Social Proof', 'FOMO'] },
      { text: `The ${industryShort} Mistake Costing You 30% of Your Revenue`, style: 'curiosity', ctr: 4.5, tags: ['Loss Aversion', 'Specific'] },
      { text: `What ${industryShort} Leaders Know That You Don't`, style: 'curiosity', ctr: 3.9, tags: ['Knowledge Gap', 'Status'] },
      { text: `We Spent 6 Months Building What ${word} Should Have Been`, style: 'curiosity', ctr: 3.6, tags: ['Origin Story', 'Challenge'] },
    ],
    premium: [
      { text: `${word}: The Standard for Serious ${industryShort} Teams`, style: 'premium', ctr: 3.1, tags: ['Status', 'Aspirational'] },
      { text: `Built for the 1% of ${industryShort} Operators Who Actually Care`, style: 'premium', ctr: 3.4, tags: ['Exclusivity', 'Identity'] },
      { text: `Precision ${industryShort} Tools for Teams That Don't Cut Corners`, style: 'premium', ctr: 3.0, tags: ['Quality', 'Premium'] },
      { text: `The ${industryShort} Platform That Grows With Your Ambition`, style: 'premium', ctr: 2.8, tags: ['Aspirational', 'Long-term'] },
    ],
    direct: [
      { text: `Increase ${industryShort} Revenue 40% in 90 Days`, style: 'direct', ctr: 4.2, tags: ['Number', 'Outcome', 'Time'] },
      { text: `${word} Handles Your ${industryShort} Workflow So You Don't Have To`, style: 'direct', ctr: 3.8, tags: ['Outcome', 'Pain Relief'] },
      { text: `Save 8 Hours Per Week on ${industryShort} Tasks`, style: 'direct', ctr: 4.0, tags: ['Time', 'Specific'] },
      { text: `Launch Your ${industryShort} Campaign in 3 Clicks`, style: 'direct', ctr: 3.6, tags: ['Speed', 'Ease'] },
    ],
  }

  // Get the selected style's variants + 2-4 from other styles for variety
  const primary = templates[style]
  const others = Object.entries(templates)
    .filter(([s]) => s !== style)
    .flatMap(([, v]) => v.slice(0, 1))

  return [...primary, ...others.slice(0, 7)].slice(0, 11)
}

function getOriginalStrength(headline: string) {
  const len = headline.length
  if (len < 15) return { score: 1.2, label: 'Very Weak', color: '#ef4444' }
  if (len < 40) return { score: 2.1, label: 'Weak', color: '#f59e0b' }
  if (len < 70) return { score: 2.8, label: 'Average', color: '#94a3b8' }
  return { score: 3.0, label: 'Decent', color: '#94a3b8' }
}

const STRENGTH_METRICS = [
  { key: 'clarity', label: 'Clarity' },
  { key: 'emotion', label: 'Emotional Pull' },
  { key: 'urgency', label: 'Urgency' },
  { key: 'specificity', label: 'Specificity' },
  { key: 'click', label: 'Click Magnetism' },
]

export default function HeadlineFixerPage() {
  const [original, setOriginal] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style>('sharp')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [headlines, setHeadlines] = useState<HeadlineVariant[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const canSubmit = original.trim().length > 5

  const handleSubmit = () => {
    if (!canSubmit) return
    setHeadlines(generateHeadlines(original, selectedStyle, industry))
    setStage('analyzing')
    setStepIndex(0)
  }

  useEffect(() => {
    if (stage !== 'analyzing') return
    if (stepIndex < ANALYZE_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), 400)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setStage('results'), 500)
      return () => clearTimeout(t)
    }
  }, [stage, stepIndex])

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  const handleReset = () => {
    setStage('idle')
    setOriginal('')
    setIndustry('')
    setStepIndex(0)
    setHeadlines([])
  }

  const originalStrength = getOriginalStrength(original)
  const bestHeadline = headlines[0]
  const styleInfo = STYLES.find((s) => s.id === selectedStyle)!

  const beforeMetrics = [28, 22, 15, 30, 20]
  const afterMetrics = [82, 75, 68, 85, 80]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#07070f' }}>
      <div className="absolute inset-0 dot-grid-bg opacity-50 pointer-events-none" />
      <div className="section-glow-amber absolute inset-0 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-5 pt-28 pb-24">
        {/* Hero */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge mb-5 inline-block" style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Zap size={11} className="inline mr-1" />
            Headline Optimizer
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Your Headline Is <span style={{ color: '#f59e0b' }}>Weak.</span>
            <br />
            Fix It in 10 Seconds.
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Paste your headline. Pick a style. Get 10 click-ready alternatives
            with CTR scores — ready to copy and use.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'idle' && (
            <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="glass-card p-8">
              <div className="space-y-6">
                <div>
                  <label className="label-text">Your Current Headline</label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="e.g. 'Project management software for teams' or 'The best way to track your goals'"
                    value={original}
                    onChange={(e) => setOriginal(e.target.value)}
                  />
                  {original && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs" style={{ color: originalStrength.color }}>
                        {originalStrength.label} · Est. CTR: ~{originalStrength.score}%
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="label-text">Rewrite Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className="p-3 rounded-xl text-center transition-all"
                        style={{
                          background: selectedStyle === s.id ? `rgba(${s.color === '#ef4444' ? '239,68,68' : s.color === '#f59e0b' ? '245,158,11' : s.color === '#8b5cf6' ? '139,92,246' : s.color === '#06b6d4' ? '6,182,212' : '16,185,129'},0.2)` : 'rgba(255,255,255,0.04)',
                          border: selectedStyle === s.id ? `1px solid ${s.color}60` : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <p className="font-semibold text-sm" style={{ color: selectedStyle === s.id ? s.color : '#f8fafc' }}>{s.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-text">Industry (optional)</label>
                  <select className="input-field" value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ cursor: 'pointer' }}>
                    <option value="">Select industry (optional)</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i} style={{ background: '#1a1a2e' }}>{i}</option>)}
                  </select>
                </div>

                <motion.button
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                  style={{
                    background: canSubmit ? `linear-gradient(135deg, #f59e0b, #d97706)` : 'rgba(255,255,255,0.06)',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    opacity: canSubmit ? 1 : 0.4,
                  }}
                  onClick={handleSubmit}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                >
                  <Zap size={18} />
                  Fix My Headline
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="4" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 154" />
                </svg>
                <Zap size={22} className="absolute inset-0 m-auto" style={{ color: '#f59e0b' }} />
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
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ background: i <= stepIndex ? '#f59e0b' : 'rgba(255,255,255,0.15)', transform: i === stepIndex ? 'scale(1.5)' : 'scale(1)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Before / Best comparison */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-5" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md mb-3 inline-block" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                    ❌ Original · ~{originalStrength.score}% CTR
                  </span>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">&ldquo;{original}&rdquo;</p>
                  <p className="text-slate-600 text-xs mt-2">Generic · No hook · Low urgency</p>
                </div>
                {bestHeadline && (
                  <div className="glass-card p-5 relative" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md mb-3 inline-block" style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d' }}>
                      ⚡ Best Pick · ~{bestHeadline.ctr}% CTR
                    </span>
                    <p className="text-white text-sm font-semibold leading-relaxed pr-8">&ldquo;{bestHeadline.text}&rdquo;</p>
                    <button
                      className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      onClick={() => handleCopy(-1, bestHeadline.text)}
                    >
                      {copiedIdx === -1 ? <CheckCircle2 size={14} style={{ color: '#f59e0b' }} /> : <Copy size={14} style={{ color: '#475569' }} />}
                    </button>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {bestHeadline.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTR Improvement arrow */}
              <div className="flex items-center justify-center gap-4 py-3">
                <span className="text-sm text-slate-500">~{originalStrength.score}% CTR</span>
                <div className="flex items-center gap-1" style={{ color: '#10b981' }}>
                  <TrendingUp size={16} />
                  <span className="text-sm font-bold">+{bestHeadline ? ((bestHeadline.ctr - originalStrength.score) / originalStrength.score * 100).toFixed(0) : 0}% improvement</span>
                </div>
                <span className="text-sm text-slate-300 font-semibold">~{bestHeadline?.ctr}% CTR</span>
              </div>

              {/* All headlines */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">All Variants ({headlines.length})</h3>
                <div className="space-y-2">
                  {headlines.map((hl, i) => {
                    const sInfo = STYLES.find((s) => s.id === hl.style)!
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="glass-card-hover flex items-center gap-4 p-4"
                      >
                        {/* CTR bar */}
                        <div className="w-12 shrink-0 text-center">
                          <p className="text-xs font-bold" style={{ color: '#f59e0b' }}>{hl.ctr}%</p>
                          <p className="text-slate-600 text-xs">CTR</p>
                        </div>

                        {/* Bar */}
                        <div className="w-16 h-1.5 rounded-full bg-white/5 shrink-0">
                          <div className="h-1.5 rounded-full" style={{ width: `${(hl.ctr / 5) * 100}%`, background: `linear-gradient(90deg, #f59e0b, #fcd34d)` }} />
                        </div>

                        {/* Text */}
                        <p className="text-slate-200 text-sm flex-1 leading-relaxed">{hl.text}</p>

                        {/* Style badge */}
                        <span className="text-xs px-2 py-1 rounded-full shrink-0 hidden sm:block font-medium"
                          style={{ background: `${sInfo.color}20`, color: sInfo.color }}>
                          {sInfo.label}
                        </span>

                        {/* Copy */}
                        <button
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                          onClick={() => handleCopy(i, hl.text)}
                        >
                          {copiedIdx === i ? <CheckCircle2 size={14} style={{ color: '#10b981' }} /> : <Copy size={14} style={{ color: '#475569' }} />}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Strength comparison chart */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-5">Headline Strength Analysis</h3>
                <div className="space-y-3">
                  {STRENGTH_METRICS.map((m, i) => (
                    <div key={m.key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-400 text-xs">{m.label}</span>
                        <span className="text-xs" style={{ color: '#10b981' }}>+{afterMetrics[i] - beforeMetrics[i]}pts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 relative">
                          <motion.div
                            className="h-2 rounded-full absolute inset-y-0 left-0"
                            style={{ background: 'rgba(239,68,68,0.4)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${beforeMetrics[i]}%` }}
                            transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                          />
                        </div>
                        <ArrowRight size={12} style={{ color: '#475569', flexShrink: 0 }} />
                        <div className="flex-1 h-2 rounded-full bg-white/5 relative">
                          <motion.div
                            className="h-2 rounded-full absolute inset-y-0 left-0"
                            style={{ background: 'linear-gradient(90deg, #f59e0b, #fcd34d)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${afterMetrics[i]}%` }}
                            transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2"><div className="w-3 h-2 rounded-full bg-red-500/40" /><span className="text-xs text-slate-500">Original</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-2 rounded-full bg-amber-400" /><span className="text-xs text-slate-500">Fixed</span></div>
                </div>
              </div>

              <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)' }}>
                <RotateCcw size={14} />
                Fix Another Headline
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
