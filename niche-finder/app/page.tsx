'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  Copy,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
} from 'lucide-react'

type Stage = 'wizard' | 'analyzing' | 'results'

const INTERESTS = [
  'Marketing', 'Design', 'Coding', 'Finance', 'Fitness',
  'Cooking', 'Gaming', 'Writing', 'Photography', 'Music',
  'Productivity', 'Parenting', 'Travel', 'Business', 'AI / Tech',
  'Real Estate', 'Mental Health', 'Language Learning', 'Fashion', 'Sports',
]

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: '▶' },
  { id: 'twitter', label: 'X / Twitter', icon: '𝕏' },
  { id: 'tiktok', label: 'TikTok', icon: '♪' },
  { id: 'instagram', label: 'Instagram', icon: '◻' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'newsletter', label: 'Newsletter', icon: '✉' },
  { id: 'podcast', label: 'Podcast', icon: '🎙' },
]

const AUDIENCES = [
  'Students (18–24)',
  'Young Professionals (25–35)',
  'Entrepreneurs',
  'Parents',
  'Gen Z creators',
  'Tech workers',
  'SMB owners',
  'Creatives',
]

const ANALYZE_STEPS = [
  'Mapping your interest graph...',
  'Scanning niche demand signals...',
  'Calculating competition gaps...',
  'Identifying your unfair angles...',
  'Building your positioning...',
]

interface NicheResult {
  name: string
  angle: string
  score: number
  audience: string
  monetization: string[]
  contentIdeas: string[]
  positioning: string
}

function generateNiches(interests: string[], platform: string, audience: string): NicheResult[] {
  const combos: NicheResult[] = [
    {
      name: `${interests[0] || 'AI'} for ${audience || 'Entrepreneurs'}`,
      angle: `You explain ${interests[0] || 'technical topics'} in plain language that ${audience || 'entrepreneurs'} can actually use — without the jargon or hype.`,
      score: 94,
      audience: `~${Math.floor(Math.random() * 200 + 80)}K potential followers on ${PLATFORMS.find(p => p.id === platform)?.label || 'YouTube'}`,
      monetization: ['Paid newsletter', 'Digital products', 'Consulting calls', 'Sponsorships'],
      contentIdeas: [
        `"I tested 7 ${interests[0] || 'AI'} tools so you don't have to — here's the only one worth your time"`,
        `"The ${interests[0] || 'beginner'}'s guide to ${interests[1] || 'getting started'} (no experience needed)"`,
        `"Why most ${audience || 'people'} are using ${interests[0] || 'these tools'} wrong — and the 3-step fix"`,
      ],
      positioning: `I help ${audience || 'professionals'} use ${interests[0] || 'modern tools'} to ${interests[1] ? `master ${interests[1]}` : 'work smarter'} without the learning curve.`,
    },
    {
      name: `${interests[1] || interests[0] || 'Productivity'} + ${interests[2] || 'Business'}`,
      angle: `Bridging the gap between ${interests[1] || 'creative work'} and ${interests[2] || 'business results'} — the crossover niche almost nobody owns yet.`,
      score: 81,
      audience: `~${Math.floor(Math.random() * 150 + 50)}K potential followers`,
      monetization: ['Sponsorships', 'Course', 'Community'],
      contentIdeas: [],
      positioning: `I show ${audience || 'creators'} how to turn ${interests[1] || 'their skills'} into a real business.`,
    },
    {
      name: `Anti-${interests[0] || 'hustle'} ${interests[2] || 'Productivity'}`,
      angle: `The contrarian take on ${interests[0] || 'your niche'} — challenging conventional wisdom and building an audience that actually thinks.`,
      score: 73,
      audience: `~${Math.floor(Math.random() * 100 + 30)}K potential followers`,
      monetization: ['Paid newsletter', 'Book', 'Speaking'],
      contentIdeas: [],
      positioning: `I challenge the ${interests[0] || 'mainstream'} narrative and teach ${audience || 'people'} what actually works.`,
    },
  ]
  return combos
}

export default function NicheFinderPage() {
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState<string[]>([])
  const [platform, setPlatform] = useState('')
  const [audience, setAudience] = useState('')
  const [stage, setStage] = useState<Stage>('wizard')
  const [stepIndex, setStepIndex] = useState(0)
  const [niches, setNiches] = useState<NicheResult[]>([])
  const [copied, setCopied] = useState(false)

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : prev.length < 5 ? [...prev, item] : prev
    )
  }

  const canNext = () => {
    if (step === 1) return interests.length >= 2
    if (step === 2) return platform !== ''
    if (step === 3) return audience !== ''
    return false
  }

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1)
    } else {
      startAnalysis()
    }
  }

  const startAnalysis = () => {
    setNiches(generateNiches(interests, platform, audience))
    setStage('analyzing')
    setStepIndex(0)
  }

  useEffect(() => {
    if (stage !== 'analyzing') return
    if (stepIndex < ANALYZE_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex((i) => i + 1), 480)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setStage('results'), 600)
      return () => clearTimeout(t)
    }
  }, [stage, stepIndex])

  const handleReset = () => {
    setStep(1)
    setInterests([])
    setPlatform('')
    setAudience('')
    setStage('wizard')
    setStepIndex(0)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const topNiche = niches[0]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#07070f' }}>
      <div className="absolute inset-0 dot-grid-bg opacity-50 pointer-events-none" />
      <div className="section-glow-cyan absolute inset-0 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-5 pt-28 pb-24">
        {/* Hero */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge mb-5 inline-block" style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}>
            <Compass size={11} className="inline mr-1" />
            Niche Discovery
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.1]">
            Find the Niche You Can{' '}
            <span style={{ color: '#06b6d4' }}>Actually Win</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Stop creating content for nobody. Three questions. Get your unfair
            angle, content ideas, and positioning — ready to use.
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
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-400"
                    style={{ background: i < step ? 'linear-gradient(90deg, #06b6d4, #0891b2)' : i === step ? '#06b6d4' : 'rgba(255,255,255,0.08)' }}
                  />
                ))}
                <span className="text-xs text-slate-500 ml-1 shrink-0">{step}/3</span>
              </div>

              <div className="min-h-[260px]">
                {step === 1 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-1">What do you know about?</h2>
                    <p className="text-slate-500 text-sm mb-5">Pick 2–5 topics. The overlap between them is where your niche lives.</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleInterest(item)}
                          className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                          style={{
                            background: interests.includes(item) ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.05)',
                            border: interests.includes(item) ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            color: interests.includes(item) ? '#67e8f9' : '#94a3b8',
                            opacity: !interests.includes(item) && interests.length >= 5 ? 0.4 : 1,
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs mt-4">{interests.length}/5 selected · min 2</p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-1">Where do you want to create?</h2>
                    <p className="text-slate-500 text-sm mb-5">Pick your primary platform. You can always expand later.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className="p-4 rounded-xl text-left flex items-center gap-3 transition-all"
                          style={{
                            background: platform === p.id ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                            border: platform === p.id ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <span className="text-lg w-8 text-center">{p.icon}</span>
                          <span className="font-medium text-sm" style={{ color: platform === p.id ? '#67e8f9' : '#f8fafc' }}>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-white font-bold text-xl mb-1">Who&apos;s your dream audience?</h2>
                    <p className="text-slate-500 text-sm mb-5">Be specific. &ldquo;Everyone&rdquo; is a strategy that works for nobody.</p>
                    <div className="space-y-2">
                      {AUDIENCES.map((a) => (
                        <button
                          key={a}
                          onClick={() => setAudience(a)}
                          className="w-full p-3.5 rounded-xl text-left flex items-center justify-between transition-all"
                          style={{
                            background: audience === a ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                            border: audience === a ? '1px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <span className="text-sm font-medium" style={{ color: audience === a ? '#67e8f9' : '#f8fafc' }}>{a}</span>
                          {audience === a && <CheckCircle2 size={16} style={{ color: '#06b6d4' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <motion.button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: canNext() ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255,255,255,0.06)', color: '#fff', cursor: canNext() ? 'pointer' : 'not-allowed' }}
                  whileTap={canNext() ? { scale: 0.97 } : {}}
                >
                  {step === 3 ? 'Find My Niche' : 'Continue'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="4" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 154" />
                </svg>
                <Compass size={22} className="absolute inset-0 m-auto" style={{ color: '#06b6d4' }} />
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
                    style={{ background: i <= stepIndex ? '#06b6d4' : 'rgba(255,255,255,0.15)', transform: i === stepIndex ? 'scale(1.5)' : 'scale(1)' }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'results' && topNiche && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Top niche */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-7 relative overflow-hidden"
                style={{ borderColor: 'rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.06)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }} />
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block"
                      style={{ background: 'rgba(6,182,212,0.2)', color: '#67e8f9' }}>
                      #1 Best Match
                    </span>
                    <h2 className="text-white font-black text-xl leading-tight">{topNiche.name}</h2>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black" style={{ color: '#06b6d4' }}>{topNiche.score}%</div>
                    <div className="text-xs text-slate-500">match</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{topNiche.angle}</p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Users size={14} style={{ color: '#06b6d4' }} />
                    <span className="text-slate-400 text-xs">{topNiche.audience}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign size={14} style={{ color: '#06b6d4', flexShrink: 0 }} className="mt-0.5" />
                    <span className="text-slate-400 text-xs">{topNiche.monetization.join(' · ')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Alternative niches */}
              <div className="grid sm:grid-cols-2 gap-4">
                {niches.slice(1).map((niche, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-slate-500 font-medium">#{i + 2} Alternative</span>
                      <span className="text-sm font-bold" style={{ color: '#06b6d4' }}>{niche.score}%</span>
                    </div>
                    <p className="text-white font-semibold text-sm mb-2">{niche.name}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{niche.angle}</p>
                  </motion.div>
                ))}
              </div>

              {/* Content ideas */}
              <div className="glass-card p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Lightbulb size={16} style={{ color: '#06b6d4' }} />
                  First 3 Content Ideas
                </h3>
                <div className="space-y-3">
                  {topNiche.contentIdeas.map((idea, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5" style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9' }}>
                        Day {i + 1}
                      </span>
                      <p className="text-slate-300 text-sm">{idea}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positioning statement */}
              <div className="glass-card p-6" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: '#06b6d4' }} />
                  Your Bio Formula
                </h3>
                <p className="text-slate-500 text-xs mb-3">Copy this to your profile. Customize the details.</p>
                <div className="p-4 rounded-xl relative" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <p className="text-white text-sm font-medium pr-10 leading-relaxed">{topNiche.positioning}</p>
                  <button
                    className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => handleCopy(topNiche.positioning)}
                  >
                    {copied ? <CheckCircle2 size={14} style={{ color: '#06b6d4' }} /> : <Copy size={14} style={{ color: '#475569' }} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}
              >
                <RotateCcw size={14} />
                Find Another Niche
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
