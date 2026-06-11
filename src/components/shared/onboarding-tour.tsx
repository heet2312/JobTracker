'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  Zap, KeyRound, Plus, Kanban, Brain, CheckCircle2, ChevronRight, ChevronLeft,
  ShieldCheck, BarChart3, FileText, Mail, Calendar, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils/cn'
import { completeOnboardingAction } from '@/lib/actions/user.actions'

const TOUR_KEY = (userId: string) => `tour_done_${userId}`

interface Step {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  extra?: React.ReactNode
}

const steps: Step[] = [
  {
    icon: Zap,
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
    title: 'Welcome to AI Job Tracker',
    description:
      'The operating system for your job search. This quick tour covers everything you need to hit the ground running — it takes under 2 minutes.',
  },
  {
    icon: KeyRound,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    title: 'Add your AI key first',
    description:
      'All AI features run on your own API key — Google Gemini, OpenAI, or Anthropic Claude. Head to Settings → AI Provider to connect it.',
    extra: (
      <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your key is stored <strong className="text-foreground">only in your browser&apos;s localStorage</strong> — it is never sent to our database and never visible to us.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Plus,
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    title: 'Import any job in seconds',
    description:
      'Paste a job description, enter a URL, or upload a PDF. AI extracts every detail automatically — title, company, salary, skills, tech stack, and more.',
    extra: (
      <div className="mt-4 flex flex-wrap gap-2">
        {['Paste job description', 'Paste URL', 'Upload PDF'].map((m) => (
          <span
            key={m}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Kanban,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    title: 'Track your pipeline',
    description:
      'Drag applications through 13 stages — Saved, Applied, Screening, Interview rounds, Offer, Accepted, Rejected, Ghosted, and more. Every move is logged automatically.',
    extra: (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted'].map((s) => (
          <span key={s} className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {s}
          </span>
        ))}
        <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
          +7 more
        </span>
      </div>
    ),
  },
  {
    icon: Brain,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    title: 'AI toolkit for every job',
    description: 'Each imported job unlocks a full AI suite — all powered by your key:',
    extra: (
      <ul className="mt-4 space-y-2">
        {[
          { icon: BarChart3, label: 'Match score across 5 dimensions' },
          { icon: FileText, label: 'ATS-optimized resume version' },
          { icon: FileText, label: 'Tone-matched cover letter' },
          { icon: Mail, label: '5 outreach messages (email + LinkedIn)' },
          { icon: Brain, label: 'Full interview prep kit' },
          { icon: Calendar, label: 'Timed follow-up drafts' },
        ].map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            {label}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-400',
    title: "You're all set!",
    description: 'Two steps to unlock everything:',
    extra: (
      <ol className="mt-4 space-y-3">
        <li className="flex items-start gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            1
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Go to <strong className="text-foreground">Settings → AI Provider</strong> and add your API key.
          </p>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Go to <strong className="text-foreground">Import Job</strong> and paste your first job description.
          </p>
        </li>
      </ol>
    ),
  },
]

export function OnboardingTour() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isLoaded || !user) return
    const done = localStorage.getItem(TOUR_KEY(user.id))
    if (!done) {
      const t = setTimeout(() => setOpen(true), 700)
      return () => clearTimeout(t)
    }
  }, [isLoaded, user])

  useEffect(() => {
    function handleReplay() {
      setStep(0)
      setOpen(true)
    }
    window.addEventListener('tour:replay', handleReplay)
    return () => window.removeEventListener('tour:replay', handleReplay)
  }, [])

  const dismiss = useCallback(() => {
    if (!user) return
    localStorage.setItem(TOUR_KEY(user.id), '1')
    setOpen(false)
    completeOnboardingAction().catch(() => {})
  }, [user])

  function next() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      dismiss()
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1))
  }

  const current = steps[step]
  const Icon = current.icon
  const isLast = step === steps.length - 1

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss() }}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{current.title}</DialogTitle>

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

        <div className="p-8">
          {/* Icon */}
          <div className={cn('mb-6 flex h-14 w-14 items-center justify-center rounded-2xl', current.iconBg)}>
            <Icon className={cn('h-7 w-7', current.iconColor)} />
          </div>

          {/* Step badge */}
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>

          {/* Title */}
          <h2 className="text-xl font-bold tracking-tight mb-2">{current.title}</h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>

          {/* Extra content */}
          {current.extra}

          {/* Final step CTAs */}
          {isLast && (
            <div className="mt-6 flex flex-col gap-2">
              <Button
                className="w-full gap-2"
                onClick={() => {
                  dismiss()
                  router.push('/import')
                }}
              >
                Import my first job
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  dismiss()
                  router.push('/settings')
                }}
              >
                Go to Settings
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-8 py-4">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  i === step ? 'w-4 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40'
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-8 px-3"
              onClick={dismiss}
            >
              Skip
            </Button>
            {step > 0 && (
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={back}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {!isLast && (
              <Button size="sm" className="h-8 gap-1 px-3" onClick={next}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
