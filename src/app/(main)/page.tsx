'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowRight, User } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-display text-xl font-semibold text-ink">CV EasyMaker</span>
          </div>
          <nav className="flex items-center gap-6">
            {session?.user ? (
              <>
                <span className="flex items-center gap-2 text-sm font-ui text-muted">
                  <User className="w-4 h-4" />
                  {session.user.name || session.user.email}
                </span>
                <Link
                  href="/dashboard"
                  className="font-ui text-sm font-medium px-4 py-2 bg-ink text-paper hover:bg-accent transition-colors rounded-sm"
                >
                  My CVs
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="font-ui text-sm text-muted hover:text-ink transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/interview/new"
                  className="font-ui text-sm font-medium px-4 py-2 bg-ink text-paper hover:bg-accent transition-colors rounded-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-ui text-sm uppercase tracking-[0.2em] text-accent mb-6">
            From Interview to ATS-Optimized CV
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-medium text-ink leading-[1.1] mb-8">
            Your next job starts with a great CV
          </h1>
          <p className="text-xl text-muted font-body leading-relaxed mb-12 max-w-xl mx-auto">
            Answer guided questions. Get a CV that passes ATS screening with 90% success rate.
            No templates. No generic content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/interview/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-paper font-ui font-medium hover:bg-accent transition-colors rounded-sm group"
            >
              Start Your Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/preview"
              className="inline-flex items-center justify-center px-8 py-4 border border-ink text-ink font-ui font-medium hover:bg-ink hover:text-paper transition-colors rounded-sm"
            >
              See Example CV
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-accent-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-medium text-ink text-center mb-16">
            Why interview-driven?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-accent text-paper font-display text-xl flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-2">
                ATS-Optimized
              </h3>
              <p className="text-muted font-body leading-relaxed">
                Every bullet is crafted to pass ATS keywords scan. No graphics, no tables,
                no columns — just clean formatting that systems can read.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent text-paper font-display text-xl flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-2">
                SMART Bullets
              </h3>
              <p className="text-muted font-body leading-relaxed">
                Raw answers transform into achievement-based bullets with metrics.
                "Increased sales" becomes "Increase sales 35% (Q1-Q3 2024)."
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent text-paper font-display text-xl flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-display font-semibold text-ink mb-2">
                Real-Time Preview
              </h3>
              <p className="text-muted font-body leading-relaxed">
                See your CV update as you answer each question.
                No surprises at the end — you control what goes on your CV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-ink mb-6">
            Ready to create your ATS-ready CV?
          </h2>
          <p className="text-lg text-muted font-body mb-8">
            Takes about 15-20 minutes. {session ? 'Your data will be auto-filled.' : 'No account required.'}
          </p>
          <Link
            href="/interview/new"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-paper font-ui font-medium hover:bg-ink transition-colors rounded-sm"
          >
            Begin Interview
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-ui text-sm text-muted">
            © 2026 CV EasyMaker. Built for job seekers.
          </p>
          <div className="flex items-center gap-6">
            {session ? (
              <Link href="/dashboard" className="font-ui text-sm text-muted hover:text-ink">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="font-ui text-sm text-muted hover:text-ink">
                Sign in
              </Link>
            )}
            <Link href="/preview" className="font-ui text-sm text-muted hover:text-ink">
              Preview
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
