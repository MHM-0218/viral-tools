'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Share2,
  RotateCcw,
  TrendingUp,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

type Stage = 'wizard' | 'analyzing' | 'results'

const AUDIENCES = [
  'Indie Hackers',
  'SaaS Founders',
  'Freelancers',
  'Students',
  'SMBs',
  'Enterprise',
  'Consumers',
  'Creators',
  'Developers',
  'E-commerce',
]

const MARKET_SIZES = [
  { id: 'niche', label: 'Niche', sub: '< $100M TAM', score: 40 },
  { id: 'mid', label: 'Mid-size', sub: '$100M – $1B', score: 70 },
  { id: 'large', label: 'Large', sub: '$1B+', score: 85 },
  { id: 'unclear', label: 'Not sure yet', sub: "I haven't checked", score: 50 },
]

const COMPETITION = [
  { id: 'none', label: 'Not competitive', sub: 'Blue ocean — few direct rivals', score: 80 },
  { id: 'some', label: 'Some competition', sub: 'A few alternatives exist', score: 65 },
  { id: 'high', label: 'Very competitive', sub: 'Crowded space', score: 45 },
  { id: 'red', label: 'Red ocean', sub: 'Massive incumbents everywhere', score: 30 },
]

const MONETIZATION = [
  'Subscription (SaaS)',
  'One-time purchase',
  'Marketplace fees',
  'Advertising',
  'Usage-based',
  'Services / consulting',
  'Freemium',
  'API access',
]

const ANALYZE_STEPS = [
  'Analyzing market opportunity...',
  'Checking competition density...',
  'Evaluating monetization fit...',
  'Scoring idea clarity...',
  'Generating verdict...',
]

function getVerdict(score: number) {
  if (score >= 80) return { label: '🚀 High Potential', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' }
  if (score >= 65) return { label: '⚡ Worth Testing', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)' }
  if (score >= 45) return { label: '⚠️ Risky Bet', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }
  return { label: '💀 Probably Skip', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' }
}

export default function IdeaScorePage() {
  const [step, setStep] = useState(1)
  const [idea, setIdea] = useState('')
  const [audiences, setAudiences] = useState<string[]>([])
  const [marketSize, setMarketSize] = useState('')
  const [competition, setCompetition] = useState('')
  const [monetizations, setMonetizations] = useState<string[]>([])
  const [stage, setStage] = useState<Stage>('wizard')
  const [stepIndex, setStepIndex] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [radarData, setRadarData] = useState<{ subject: string; score: number }[]>([])

  const totalSteps = 5

  const toggleAudience = (a: string) => {
    setAudiences((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  const toggleMono = (m: string) => {
    setMonetizations((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )
  }

  const canNext = () => {
    if (step === 1) return idea.trim().length > 15
    if (step === 2) return audiences.length > 0
    if (step === 3) return marketSize !== ''
    if (step === 4) return competition !== ''
    if (step === 5) return monetizations.length > 0
    return false
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1)
    } else {
      startAnalysis()
    }
  }

  const startAnalysis = () => {
    const mScore = MARKET_SIZES.find((m) => m.id === marketSize)?.score ?? 50
    const cScore = COMPETITION.find((c) => c.id === competition)?.score ?? 50
    const ideaScore = Math.min(100, idea.length * 2 + 30)
    const monoScore = Math.min(100, monetizations.length * 20 + 40)
    const audienceScore = Math.min(100, audiences.length * 15 + 30)

    const total = Math.round(
      (mScore * 0.25 + cScore * 0.25 + ideaScore * 0.15 + monoScore * 0.2 + audienceScore * 0.15)
    )
    setFinalScore(total)
    setRadarData([
      { subject: 'Market', score: mScore },
      { subject: 'Competition', score: cScore },
      { subject: 'Clarity', score: ideaScore },
      { subject: 'Monetization', score: monoScore },
      { subject: 'Audience', score: audienceScore },
    ])

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
        animateScore(finalScore)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [stage, stepIndex, finalScore])

  function animateScore(target: number) {
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + 2, target)
      setDisplayScore(current)
      if (current >= target) clearInterval(interval)
    }, 20)
  }

  const handleReset = () => {
    setStep(1)
    setIdea('')
    setAudiences([])
    setMarketSize('')
    setCompetition('')
    setMonetizations([])
    setStage('wizard')
    setDisplayScore(0)
    setStepIndex(0)
  }

  const verdict = getVerdict(finalScore)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#07070f' }}>
      <div className="absolute inset-0 dot-grid-bg opacity-50 pointer-events-none" />
      <div className="section-glow-purple absolute inset-0 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-5 pt-28 pb-24">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span
            className="badge mb-5 inline-block"
            style={{
              background: 'rgba(139,92,246,0.15)',
              color: '#c4b5fd',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <Lightbulb size={11} className="inline mr-1" />
            Idea Validator
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Is Your Startup Idea{' '}
            <span style={{ color: '#8b5cf6' }}>Worth 6 Months</span>
            <br />
            of Your Life?
          </h1>
          <p className="text-slate-400 text-base">
            Answer 5 quick questions. Get a brutally honest score with radar
            analysis and a go/no-go verdict.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'wizard' && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-8"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-400"
                    style={{
                      background:
                        i < step
                          ? 'linear-gradient(90deg, #8b5cf6, #6366f1)'
                          : i === step - 1
                          ? '#8b5cf6'
                          : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1 shrink-0">
                  {step}/{totalSteps}
                </span>
              </div>

              {/* Step content */}
              <div className="min-h-[240px]">
                {step === 1 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">
                      What&apos;s your startup idea?
                    </h2>
                    <p className="text-slate-500 text-sm mb-5">
                      Describe it in 2–3 sentences. Be specific — vague inputs get vague scores.
                    </p>
                    <textarea
                      className="input-field resize-none"
                      rows={5}
                      placeholder="e.g. A tool that automatically turns Loom recordings into structured SOPs and training docs, targeting remote-first companies with 10–100 employees..."
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                    />
                    <p className="text-slate-600 text-xs mt-2 text-right">
                      {idea.length} chars · min 15
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">Who&apos;s it for?</h2>
                    <p className="text-slate-500 text-sm mb-5">
                      Select all that apply. The tighter the audience, the higher the score.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AUDIENCES.map((a) => (
                        <button
                          key={a}
                          onClick={() => toggleAudience(a)}
                          className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                          style={{
                            background: audiences.includes(a)
                              ? 'rgba(139,92,246,0.25)'
                              : 'rgba(255,255,255,0.05)',
                            border: audiences.includes(a)
                              ? '1px solid rgba(139,92,246,0.5)'
                              : '1px solid rgba(255,255,255,0.08)',
                            color: audiences.includes(a) ? '#c4b5fd' : '#94a3b8',
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">
                      How big is the market?
                    </h2>
                    <p className="text-slate-500 text-sm mb-5">
                      Honest answers only. &ldquo;Unclear&rdquo; is a valid answer.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {MARKET_SIZES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMarketSize(m.id)}
                          className="p-4 rounded-xl text-left transition-all duration-150"
                          style={{
                            background:
                              marketSize === m.id
                                ? 'rgba(139,92,246,0.2)'
                                : 'rgba(255,255,255,0.04)',
                            border:
                              marketSize === m.id
                                ? '1px solid rgba(139,92,246,0.5)'
                                : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <p
                            className="font-semibold text-sm"
                            style={{ color: marketSize === m.id ? '#c4b5fd' : '#f8fafc' }}
                          >
                            {m.label}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">{m.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">
                      How competitive is the space?
                    </h2>
                    <p className="text-slate-500 text-sm mb-5">
                      Competition isn&apos;t always bad — it means there&apos;s a market.
                    </p>
                    <div className="space-y-2">
                      {COMPETITION.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCompetition(c.id)}
                          className="w-full p-4 rounded-xl text-left flex items-center justify-between transition-all duration-150"
                          style={{
                            background:
                              competition === c.id
                                ? 'rgba(139,92,246,0.2)'
                                : 'rgba(255,255,255,0.04)',
                            border:
                              competition === c.id
                                ? '1px solid rgba(139,92,246,0.5)'
                                : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div>
                            <p
                              className="font-semibold text-sm"
                              style={{ color: competition === c.id ? '#c4b5fd' : '#f8fafc' }}
                            >
                              {c.label}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">{c.sub}</p>
                          </div>
                          {competition === c.id && (
                            <CheckCircle2 size={16} style={{ color: '#8b5cf6' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-2">
                      How will you make money?
                    </h2>
                    <p className="text-slate-500 text-sm mb-5">
                      Multiple paths are fine — more options = higher score.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MONETIZATION.map((m) => (
                        <button
                          key={m}
                          onClick={() => toggleMono(m)}
                          className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                          style={{
                            background: monetizations.includes(m)
                              ? 'rgba(139,92,246,0.25)'
                              : 'rgba(255,255,255,0.05)',
                            border: monetizations.includes(m)
                              ? '1px solid rgba(139,92,246,0.5)'
                              : '1px solid rgba(255,255,255,0.08)',
                            color: monetizations.includes(m) ? '#c4b5fd' : '#94a3b8',
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-30"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <motion.button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: canNext()
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                      : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    cursor: canNext() ? 'pointer' : 'not-allowed',
                  }}
                  whileTap={canNext() ? { scale: 0.97 } : {}}
                >
                  {step === totalSteps ? 'Score My Idea' : 'Continue'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-12 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="4" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 154" />
                </svg>
                <Lightbulb size={22} className="absolute inset-0 m-auto" style={{ color: '#8b5cf6' }} />
              </div>

              <div className="h-6 mb-3">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-white font-medium"
                  >
                    {ANALYZE_STEPS[stepIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-1.5 mt-6">
                {ANALYZE_STEPS.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ background: i <= stepIndex ? '#8b5cf6' : 'rgba(255,255,255,0.15)', transform: i === stepIndex ? 'scale(1.5)' : 'scale(1)' }} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* Score + verdict */}
              <div className="glass-card p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
                <p className="text-slate-500 text-sm uppercase tracking-widest mb-3">Idea Score</p>
                <motion.div className="text-8xl font-black mb-1" style={{ color: '#8b5cf6', textShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
                  {displayScore}
                </motion.div>
                <p className="text-slate-500 text-sm mb-4">/100</p>
                <span className="badge text-sm px-4 py-2" style={{ background: verdict.bg, color: verdict.color, border: `1px solid ${verdict.border}` }}>
                  {verdict.label}
                </span>
              </div>

              {/* Radar Chart */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-5">Dimension Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Radar name="score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strengths + Risks */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-6" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                    Strengths
                  </h4>
                  <ul className="space-y-2.5">
                    {[
                      finalScore > 50 ? 'Market exists and people are paying for it' : 'Clear problem definition',
                      audiences.length > 1 ? 'Multiple audience segments to test' : 'Tight, specific target audience',
                      monetizations.length > 1 ? 'Multiple revenue streams identified' : 'Clear monetization path',
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-6" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <XCircle size={16} style={{ color: '#ef4444' }} />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2.5">
                    {[
                      competition === 'red' ? 'Massive incumbent risk — hard to stand out' : 'Competition could intensify quickly',
                      marketSize === 'niche' ? 'Niche market limits growth ceiling' : 'Large markets attract well-funded competitors',
                      monetizations.length < 2 ? 'Single revenue stream is fragile' : 'Monetization requires validation',
                    ].map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span style={{ color: '#ef4444' }} className="mt-0.5">✗</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: '#8b5cf6' }} />
                  Your Next 3 Moves
                </h3>
                <div className="space-y-3">
                  {[
                    { n: '01', text: 'Post on Indie Hackers or Reddit in the next 48h. Ask 5 real people if this solves their problem. Not friends — strangers.' },
                    { n: '02', text: "Build the smallest possible proof: a landing page, a Typeform, or a manual prototype. Don't code the full product until you have 3 people who said they'll pay." },
                    { n: '03', text: 'Search ProductHunt for similar tools. If they exist, that\'s validation. If they\'re dead, find out why before going further.' },
                  ].map((step) => (
                    <div key={step.n} className="flex items-start gap-4">
                      <span className="text-lg font-black font-mono" style={{ color: 'rgba(139,92,246,0.5)', lineHeight: 1.2 }}>{step.n}</span>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.25)' }}
                >
                  <RotateCcw size={14} />
                  Score Another Idea
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => { if (navigator.share) navigator.share({ title: `My startup idea scored ${finalScore}/100`, url: window.location.href }) }}
                >
                  <Share2 size={14} />
                  Share Results
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
