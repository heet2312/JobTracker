import Link from 'next/link'
import {
  Zap, Brain, BarChart3, Kanban, FileText, Mail, ArrowRight, Target, ShieldCheck, KeyRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Brain,
    title: 'AI Match Analysis',
    description: 'Get instant AI-powered match scores between your resume and any job. Know your odds before you apply.',
  },
  {
    icon: FileText,
    title: 'Resume Optimizer',
    description: 'Auto-tailor your resume for each role. Inject ATS keywords and quantify achievements — powered by your AI model of choice.',
  },
  {
    icon: Kanban,
    title: 'Kanban Board',
    description: 'Drag-and-drop pipeline across 13 stages. See your entire search at a glance.',
  },
  {
    icon: Mail,
    title: 'Outreach Generator',
    description: 'Generate personalized recruiter emails, LinkedIn messages, and cold outreach in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track response rates, interview conversion, and offer rates. Optimize your strategy with data.',
  },
  {
    icon: Target,
    title: 'Job Discovery',
    description: 'AI finds your best-match opportunities based on your profile. Never miss a perfect role.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AI Job Tracker</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          <KeyRound className="h-3 w-3 text-primary" />
          Bring your own AI key — Gemini, OpenAI, or Claude
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          The operating system<br />for your job search.
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Track applications, optimize resumes, generate cover letters, and get AI-powered match scores — all in one keyboard-driven workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 px-8">
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card · 30s setup · Free forever
        </p>
      </section>

      {/* Stats */}
      <div className="border-y bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Applications tracked' },
              { value: '94%', label: 'ATS pass rate' },
              { value: '3.2×', label: 'More interviews' },
              { value: '< 2 min', label: 'Resume optimization' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy / BYOK */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border bg-card p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Your API key never leaves your browser</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI Job Tracker ships with <strong className="text-foreground">zero AI credentials</strong>. You connect your own key from Google Gemini, OpenAI, or Anthropic Claude in Settings. The key is stored only in your browser&apos;s localStorage — it is never sent to our database, never logged, and never visible to us. You stay in full control of your AI usage and costs.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need to land the job</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Built for serious job seekers who treat their search like a product.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border bg-card p-6 hover:border-primary/30 transition-colors">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Start your search today</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of job seekers who've accelerated their search with AI.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 px-10">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            AI Job Tracker
          </div>
          <p>© 2026 AI Job Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
