import './index.css'
import { useState, useEffect, useRef } from 'react'

const DEFAULT_CTA_URL = 'https://vine-perch-730.notion.site/Coming-soon-33a01b956bb6808fb032e4038713152a?pvs=74'

// April 26, 2026 11:59 PM ET (UTC-4 for EDT)
const CART_CLOSE_DATE = new Date('2026-04-27T03:59:00Z')

/* ─── Fade-up on scroll ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      opacity: visible ? 1 : 0,
      transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ targetDate, centered, variant, compact }: { targetDate: Date; centered?: boolean; variant?: 'yellow'; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calc())
    const id = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (compact) {
    return (
      <span className="font-sans text-[13px] text-white/60 tabular-nums">
        {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className={`inline-flex gap-3 mt-4${centered ? ' justify-center' : ''}`}>
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className={`font-sans text-[22px] font-bold leading-none rounded px-2.5 py-1.5 min-w-[44px] text-center tabular-nums ${variant === 'yellow' ? 'bg-yellow text-black' : 'bg-white text-black'}`}>
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-wider mt-1 text-white/40">{u.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Inline CTA Block (reusable) ─── */
function CtaBlock({ centered, label, variant = 'yellow' }: { centered?: boolean; label?: string; variant?: 'yellow' | 'black' }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <a
        href={DEFAULT_CTA_URL}
        className={`inline-block font-sans text-[15px] font-bold uppercase tracking-[0.08em] px-12 py-4 rounded-lg transition-all hover:scale-[1.02] ${
          variant === 'black'
            ? 'bg-black text-yellow hover:bg-dark'
            : 'bg-yellow text-black hover:bg-yellow/90'
        }`}
      >
        {label || 'Join Low-Ticket Launchpad LIVE'}
      </a>
      <p className="font-sans text-[11px] text-white/40 uppercase tracking-wider mt-4 mb-1">{centered ? '' : ''}Cart closes in</p>
      <CountdownTimer targetDate={CART_CLOSE_DATE} centered={centered} variant="yellow" />
    </div>
  )
}

/* ─── Sticky CTA Bar ─── */
function StickyCtaBar({ heroCtaRef }: { heroCtaRef: React.RefObject<HTMLAnchorElement | null> }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = heroCtaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroCtaRef])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-yellow/20 transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-wide mx-auto px-5 h-16 flex items-center justify-between">
        <span className="hidden md:block font-display text-[12px] text-white uppercase tracking-[0.15em]">
          Low-Ticket Launchpad
        </span>
        <div className="hidden md:block">
          <CountdownTimer targetDate={CART_CLOSE_DATE} compact />
        </div>
        <a
          href={DEFAULT_CTA_URL}
          className="bg-yellow text-black font-sans text-[13px] font-bold uppercase tracking-[0.1em] px-6 py-2.5 rounded-lg hover:bg-yellow/90 transition mx-auto md:mx-0"
        >
          Join Now &mdash; $800
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 1: HERO — Full Black, Maximum Impact
   ═══════════════════════════════════════════════════════════ */
function Hero({ ctaRef }: { ctaRef: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <section className="min-h-[90vh] bg-black relative overflow-hidden">
      {/* Top announcement pill */}
      <div className="flex justify-center pt-6 pb-4 px-3">
        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 md:px-5 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="font-sans text-[10px] md:text-[12px] text-white/80 uppercase tracking-[0.08em] md:tracking-[0.12em] whitespace-nowrap">2-Week Bootcamp Kicks Off Monday, April 27</span>
        </div>
      </div>

      {/* Diagonal blue line — up, dip down, then up again */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <polyline
            points="-40,750 420,320 580,480 1480,50"
            stroke="#87B8F8"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.25"
          />
        </svg>
      </div>

      <div className="max-w-wide mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-10 md:gap-12 w-full relative z-10">
        {/* Left column — text */}
        <div className="flex-1 md:max-w-[62%] text-center md:text-left">
          {/* Pre-headline — product name */}
          <p className="font-sans text-[12px] md:text-[13px] font-bold text-yellow uppercase tracking-[0.25em] mb-5">
            Low-Ticket Launchpad Live
          </p>

          {/* Headline — outcome / transformation */}
          <h1 className="font-display text-[clamp(40px,4.8vw,60px)] text-white uppercase leading-[0.95] tracking-tight mb-5">
            How To Create & Sell A<br />
            <span className="text-yellow">$350 Digital Product</span><br />
            In 14 Days With AI
          </h1>

          {/* Subhead */}
          <p className="font-serif text-[clamp(16px,1.7vw,21px)] text-white/65 leading-snug max-w-[540px] mx-auto md:mx-0">
            Solve a specific problem. Package the solution. Productize yourself to make money online forever.
          </p>

          <a
            ref={ctaRef}
            href={DEFAULT_CTA_URL}
            className="inline-block bg-yellow text-black font-sans text-[15px] font-bold uppercase tracking-[0.1em] px-12 py-4 rounded-lg mt-8 hover:bg-yellow/90 transition-all hover:scale-[1.02]"
          >
            Join Low-Ticket Launchpad LIVE
          </a>

          <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mt-5">Cart closes in</p>
          <CountdownTimer targetDate={CART_CLOSE_DATE} variant="yellow" />
        </div>

        {/* Right column — instructor photo cards */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative w-[340px] h-[460px] md:w-[400px] md:h-[520px]">
            <div className="absolute left-0 top-0 w-[180px] md:w-[210px] -rotate-6 z-10">
              <div className="bg-blue-dark rounded-lg overflow-hidden border border-white/15 shadow-lg shadow-black/40">
                <img src="/images/cole.png" alt="Nicolas Cole" className="w-full h-[220px] md:h-[260px] object-cover object-top" />
              </div>
              <span className="block font-sans text-[13px] text-white/60 mt-2 text-center">Nicolas Cole</span>
            </div>
            <div className="absolute right-0 top-6 w-[180px] md:w-[210px] rotate-3 z-20">
              <div className="bg-blue-dark rounded-lg overflow-hidden border border-white/15 shadow-lg shadow-black/40">
                <img src="/images/dickie.png" alt="Dickie Bush" className="w-full h-[220px] md:h-[260px] object-cover object-top" />
              </div>
              <span className="block font-sans text-[13px] text-white/60 mt-2 text-center">Dickie Bush</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[180px] md:w-[210px] -rotate-2 z-30">
              <div className="bg-blue-dark rounded-lg overflow-hidden border border-white/15 shadow-lg shadow-black/40">
                <img src="/images/daniel.png" alt="Daniel Bustamante" className="w-full h-[220px] md:h-[260px] object-cover object-top" />
              </div>
              <span className="block font-sans text-[13px] text-white/60 mt-2 text-center">Daniel Bustamante</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow/30 to-transparent" />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2: CREDIBILITY BANNER — Scrolling Ticker
   ═══════════════════════════════════════════════════════════ */
function CredibilityBanner() {
  const items = [
    '$15M+ IN DIGITAL PRODUCT SALES',
    '10,000+ GRADUATES',
    '4 PRODUCT CATEGORIES',
    '300K+ SUBSCRIBERS',
  ]
  const sep = '  \u2022  '
  const text = items.join(sep)

  return (
    <section className="bg-yellow py-4 overflow-hidden">
      <div className="animate-ticker whitespace-nowrap">
        <span className="font-display text-[14px] md:text-[16px] text-black uppercase tracking-[0.12em] inline-block">
          {text}{sep}{text}{sep}
        </span>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3: HOW IT WORKS — Oversized Stat Blocks
   ═══════════════════════════════════════════════════════════ */
function HowItWorks() {
  const stats = [
    { num: '6', label: 'Live Sessions', desc: '3 per week over 2 weeks.\n60 min each. 3:00 PM ET.' },
    { num: '14', label: 'Days to Launch', desc: 'From zero to a live\ndigital product with\nsales coming in.' },
    { num: '\u221E', label: 'Lifetime Access', desc: 'All replays, slides,\ntemplates, prompts,\nand bonuses forever.' },
    { num: '3', label: 'World-Class\nInstructors', desc: 'Dickie Bush, Nicolas Cole,\n& Daniel Bustamante\u2014behind\nthe internet\'s biggest\nwriting businesses.' },
  ]

  return (
    <section className="bg-black py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-wide mx-auto">
        <div className="w-20 h-[2px] bg-blue mx-auto mb-8" />
        <h2 className="font-display text-[clamp(28px,4vw,44px)] text-white uppercase text-center leading-[0.95] mb-4">
          What Is Low-Ticket Launchpad LIVE?
        </h2>
        <p className="font-sans text-[15px] text-white/50 leading-relaxed mb-12 max-w-[620px] mx-auto text-center">
          A 14-day live cohort where you build your first digital product from scratch &mdash; or turn a stalled idea into something that actually sells. Every session, you leave with a live deliverable ready to generate revenue.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-dark border border-white/10 rounded-lg p-6 md:p-8">
              <span className="font-display text-[clamp(56px,10vw,100px)] text-blue leading-none block">{s.num}</span>
              <p className="font-sans text-[14px] font-bold text-white uppercase tracking-wider mt-2 whitespace-pre-line">{s.label}</p>
              <p className="font-sans text-[13px] text-white/35 mt-3 whitespace-pre-line leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4: INSTRUCTORS — Moved Up, Trust Section
   ═══════════════════════════════════════════════════════════ */
function Instructors() {
  const badges = ['10,000+ Graduates', '$15M+ Revenue', '400+ Inc. Columns', '300K+ Subscribers']

  return (
    <section className="bg-cream py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-wide mx-auto flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left — headline + badges */}
        <div className="flex-1">
          <p className="font-sans text-[11px] font-bold text-blue-dark uppercase tracking-[0.2em] mb-3">Meet Your Instructors</p>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] text-dark uppercase leading-[0.95] mb-6">
            Built By People Who Actually Build Digital Businesses
          </h2>
          <p className="font-sans text-[15px] text-dark/60 leading-relaxed mb-6">
            Created by the founders of Ship 30 for 30, Premium Ghostwriting Academy, Write With AI, and more.
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b} className="inline-flex items-center bg-black text-cream font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — instructor cards */}
        <div className="flex-1 space-y-6">
          {/* Nicolas Cole */}
          <div className="flex gap-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
              <img src="/images/cole-headshot.png" alt="Nicolas Cole" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-display text-[18px] text-dark uppercase">Nicolas Cole</h4>
              <p className="font-sans text-[11px] text-blue-dark font-bold uppercase tracking-wider mb-2">Co-Founder, Premium Ghostwriting Academy</p>
              <p className="font-sans text-[14px] text-dark/60 leading-relaxed">
                Author of <em className="font-semibold">The Art & Business of Online Writing</em>. 10+ years writing online. Pioneered frameworks for viral short-form writing and built four category-defining newsletters and multiple digital product businesses.
              </p>
            </div>
          </div>
          {/* Dickie Bush */}
          <div className="flex gap-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
              <img src="/images/dickie-headshot.png" alt="Dickie Bush" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-display text-[18px] text-dark uppercase">Dickie Bush</h4>
              <p className="font-sans text-[11px] text-blue-dark font-bold uppercase tracking-wider mb-2">Co-Founder, Ship 30 for 30</p>
              <p className="font-sans text-[14px] text-dark/60 leading-relaxed">
                Former Wall Street trader at BlackRock turned Digital Entrepreneur. Creator of Ship 30 for 30 &mdash; the fastest-growing cohort-based writing program on the internet. 10,000+ graduates and a digital product empire that followed.
              </p>
            </div>
          </div>
          {/* Daniel Bustamante */}
          <div className="flex gap-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
              <img src="/images/daniel-headshot.png" alt="Daniel Bustamante" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-display text-[18px] text-dark uppercase">Daniel Bustamante</h4>
              <p className="font-sans text-[11px] text-blue-dark font-bold uppercase tracking-wider mb-2">Co-Founder, Velocity</p>
              <p className="font-sans text-[14px] text-dark/60 leading-relaxed">
                Former CMO of Ship 30 for 30 and Premium Ghostwriting Academy. Helped scale Dickie and Cole's businesses to 10,000+ students, nearly 2,000 coaching clients, and $20M+ in revenue. Now Co-Founder of Velocity, the agency turning creators' audiences into recurring email revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5: IS THIS RIGHT FOR YOU? — Card Accordion
   ═══════════════════════════════════════════════════════════ */
function RightForYou() {
  const questions = [
    { q: 'Do you have expertise in a specific area but aren\'t sure <em>how to package it</em> into a digital product?', a: "This is everything you could possibly need to transform your knowledge into a profitable digital product that sells on autopilot. We've done it across multiple categories and generated over $15,000,000 in revenue. In 14 days, you'll have a product live and selling." },
    { q: 'Have you tried creating a digital product in the past but <em>it never took off?</em>', a: "Let us give you our proven system and positioning strategies to make sure the next product you create is set up for success from day one. Most stalled products don't have a content problem \u2014 they have a positioning and marketing problem. We fix both." },
    { q: 'Do you have a digital product but <em>aren\'t seeing tangible results?</em>', a: "Chances are, you're just making a few key mistakes (we made them too!) that are holding you back \u2014 and once you fix them, digital products will become the most powerful revenue engine in your business." },
    { q: 'Do you have an audience on social but <em>nothing to sell them?</em>', a: "X, LinkedIn, Substack, Instagram \u2014 you've built a following but every dollar of value is going to someone else's product. The Launchpad shows you how to package what you already know into a digital product your audience actually wants to buy." },
    { q: 'Do you want to stop <em>trading time for money</em> with services and freelancing?', a: "A low-ticket digital product sells while you sleep \u2014 no calls, no custom work, no cap on revenue. We'll show you how to build the product AND the evergreen marketing system that keeps it selling." },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-dark py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-page mx-auto">
        <div className="border-l-4 border-yellow pl-4 mb-10">
          <p className="font-sans text-[11px] font-bold text-blue uppercase tracking-[0.2em] mb-2">Is This Right For You?</p>
          <h2 className="font-display text-[clamp(28px,4vw,40px)] text-cream uppercase leading-[0.95]">
            Let's Find Out
          </h2>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`bg-black/50 border rounded-lg px-6 py-5 cursor-pointer transition-all ${
                open === i ? 'border-blue/40' : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="font-sans text-[16px] md:text-[18px] text-cream font-medium pr-4 [&_em]:not-italic [&_em]:text-yellow"
                  dangerouslySetInnerHTML={{ __html: q.q }}
                />
                <span className={`text-[20px] flex-shrink-0 transition-colors ${open === i ? 'text-blue' : 'text-white/30'}`}>
                  {open === i ? '\u2212' : '+'}
                </span>
              </div>
              {open === i && (
                <p className="font-sans text-[14px] text-white/50 leading-relaxed mt-4 pb-1">{q.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-serif text-[18px] text-cream/60 italic mb-6">If any of these sound like you&hellip; this bootcamp was made for you.</p>
          <CtaBlock centered />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6: SESSIONS ROADMAP — Vertical Timeline
   ═══════════════════════════════════════════════════════════ */
function SessionRoadmap() {
  const sessions = [
    { num: 1, date: 'Mon Apr 27', title: 'How To Make Your First $1 Online', desc: "Stop overthinking and start selling. Identify a profitable problem your audience needs solved \u2014 and why the first dollar is the hardest and most important one you'll ever make.", deliverable: 'One validated problem your target reader needs help solving.' },
    { num: 2, date: 'Wed Apr 29', title: 'Building A "Template" Worth $99', desc: "Take the problem you identified and turn it into a simple, actionable template your audience will pay for. No courses. No ebooks. Just a clean deliverable that solves a real problem.", deliverable: 'A finished $99 digital template ready to list for sale.' },
    { num: 3, date: 'Fri May 1', title: 'Tech Stack & Going Live', desc: "Get your product listed, your checkout working, and your first marketing assets in place. Pin it to your social profiles, set up your evergreen CTA, and send the launch.", deliverable: 'Your first digital product live and for sale.' },
    { num: 4, date: 'Mon May 4', title: 'Offer Creation & Bonus Bundling', desc: "Turn the problem from your $99 template into a full digital course. Stack bonuses, create irresistible offers, and price your course so it feels like a no-brainer.", deliverable: 'A complete offer stack with bonus bundle ready to build.' },
    { num: 5, date: 'Wed May 6', title: 'Outline Your Course In 1 Hour', desc: "Use a proven AI-assisted framework to go from a blank page to a full course outline in a single session. Module structure, lesson flow, and deliverables \u2014 all mapped out.", deliverable: 'A complete course outline with every module mapped.' },
    { num: 6, date: 'Fri May 8', title: 'Evergreen Marketing & Launch', desc: "Build the system that keeps your products selling long after launch day. Map your full funnel \u2014 social traffic, email opt-ins, landing page visits, and conversion rates.", deliverable: 'An evergreen marketing strategy and revenue tracking system.' },
  ]

  return (
    <section className="bg-cream py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-page mx-auto">
        <p className="font-sans text-[11px] font-bold text-blue-dark uppercase tracking-[0.2em] mb-3 text-center">The 6 Sessions</p>
        <h2 className="font-display text-[clamp(28px,4vw,44px)] text-dark uppercase text-center leading-[0.95] mb-3">
          Here's What You'll Build
        </h2>
        <p className="font-sans text-[14px] text-dark/50 mb-12 text-center">
          All sessions 60 min &middot; M/W/F &middot; 3:00 PM ET &middot; April 27 &ndash; May 8
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — visible on md+ */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-blue/25 -translate-x-1/2" />
          {/* Vertical line — mobile, on left */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-[2px] bg-blue/25" />

          <div className="space-y-8 md:space-y-12">
            {sessions.map((s) => {
              const isEven = s.num % 2 === 0
              return (
                <div key={s.num} className="relative">
                  {/* Circle on the line */}
                  <div className={`absolute z-10 w-10 h-10 rounded-full bg-blue flex items-center justify-center left-0.5 md:left-1/2 md:-translate-x-1/2`}>
                    <span className="font-display text-[18px] text-white">{s.num}</span>
                  </div>

                  {/* Content — desktop alternating, mobile always right */}
                  <div className={`pl-14 md:pl-0 md:w-[45%] ${isEven ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12 md:text-right'}`}>
                    <span className="inline-flex bg-black text-yellow font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                      {s.date}
                    </span>
                    <h3 className="font-display text-[clamp(18px,2.5vw,26px)] text-dark uppercase leading-[1.05] mt-1 mb-2">{s.title}</h3>
                    <p className="font-sans text-[14px] text-dark/55 leading-relaxed mb-2">{s.desc}</p>
                    <p className={`font-sans text-[13px] text-blue-dark font-semibold ${isEven ? '' : 'md:ml-auto'}`}>
                      &rarr; You leave with: <span className="font-normal text-dark/50">{s.deliverable}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bold closing statement */}
        <div className="mt-16 text-center">
          <h3 className="font-display text-[clamp(24px,3.5vw,40px)] text-dark uppercase leading-[1] mb-6">
            We Build <span className="text-blue">Together</span>. You Show Up.<br />You Leave With <span className="text-blue">A Product That Sells</span>.
          </h3>
          <p className="font-sans text-[15px] text-dark/60 mb-8">
            This isn't self-paced content you buy and forget.
          </p>
          <CtaBlock centered />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 7: BONUSES — 3-Column Card Grid
   ═══════════════════════════════════════════════════════════ */
function Bonuses() {
  const bonuses = [
    { num: 1, title: 'Product Idea Extraction Prompt', desc: 'The exact AI prompt to mine your existing content for profitable product ideas. Feed it your posts, newsletters, or threads.', value: '$99' },
    { num: 2, title: 'Template Swipe File', desc: 'Proven $99 template examples across different niches \u2014 see what sells, how it\'s structured, and why people pay.', value: '$149', img: 3 },
    { num: 3, title: 'Course Outline AI Prompt', desc: 'Takes one problem and expands it into a full course curriculum \u2014 modules, lessons, deliverables \u2014 in under an hour.', value: '$99', img: 2 },
    { num: 4, title: 'Landing Page Copy Templates', desc: 'High-converting sales page templates for your $99 template and $350 course. Headlines, offer stacks, CTAs, guarantee blocks.', value: '$149' },
    { num: 5, title: 'Evergreen Marketing Playbook', desc: 'The complete system for selling digital products on autopilot \u2014 social CTAs, email sequences, pinned posts.', value: '$99' },
    { num: 6, title: 'Revenue Tracker Spreadsheet', desc: 'Track your full funnel: top-of-funnel reach, email opt-ins, landing page traffic, and conversion rates.', value: '$99' },
  ]

  return (
    <section className="bg-black py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-wide mx-auto">
        <p className="font-sans text-[11px] font-bold text-blue uppercase tracking-[0.2em] mb-3 text-center">Free Bonuses Included</p>
        <h2 className="font-display text-[clamp(28px,4vw,44px)] text-white uppercase text-center leading-[0.95] mb-3">
          Everything You Need To Build,<br />Launch, And Keep Selling
        </h2>
        <div className="w-full h-px bg-white/10 mb-10 max-w-page mx-auto" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-page mx-auto">
          {bonuses.map((b) => (
            <div key={b.num} className="bg-dark border border-white/8 rounded-lg overflow-hidden">
              <div className="h-40 bg-cream flex items-center justify-center p-4 rounded-t-lg">
                <img src={`/images/bonus-${b.num}.png`} alt={b.title} className="max-h-full max-w-full object-contain" loading="lazy" />
              </div>
              <div className="p-6">
                <span className="font-sans text-[10px] font-bold text-yellow uppercase tracking-widest">Bonus #{b.num}</span>
                <h3 className="font-sans text-[16px] font-bold text-cream mt-1 mb-2">{b.title}</h3>
                <p className="font-sans text-[13px] text-white/40 leading-relaxed mb-4">{b.desc}</p>
                <p className="font-sans text-[14px] text-blue font-bold">{b.value} value</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-display text-[24px] text-white uppercase mb-6">Over $694 In Free Bonuses</p>
          <CtaBlock centered />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 7b: AI WRITING SKOOL — Free Included
   ═══════════════════════════════════════════════════════════ */
function AIWritingSkool() {
  const perks = [
    { title: 'AI Cole', desc: 'Our custom AI model trained on all of our programs, curriculums, books, and content. Ask it anything, 24/7.', value: '$5,000+ value' },
    { title: 'Monday Hot Seats with Cole', desc: 'Submit your questions and workshop your specific situation live.', value: '$3,000+ value' },
    { title: 'Weekly AI/Tech Clinic with Mitch Harris', desc: 'Office hours to troubleshoot, learn new AI tools, and stay on the cutting edge.', value: '$1,500+ value' },
    { title: 'Monthly Mini-Products, Templates, Prompts, and .Skills', desc: 'New resources dropped every month that you can download and use immediately.', value: '$1,000+ value' },
  ]

  return (
    <section className="bg-dark py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-page mx-auto">
        <p className="font-sans text-[11px] font-bold text-blue uppercase tracking-[0.2em] mb-3">Included Free</p>
        <h2 className="font-display text-[clamp(28px,4vw,44px)] text-cream uppercase leading-[0.95] mb-3">
          Free 30-Day Trial To AI Writing Skool
        </h2>
        <div className="w-full h-px bg-white/10 mb-10" />

        <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-10 max-w-[700px]">
          AI Writing Skool is THE community for writers and creators building in the new AI Economy &mdash; and you get full access for 30 days so you can get feedback on your product, trade ideas, and stay sharp as you build.
        </p>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start mb-10">
          <div className="w-full md:w-[45%] flex-shrink-0">
            <img src="/images/AIWS.png" alt="AI Writing Skool" className="w-full object-contain rounded-lg" loading="lazy" />
          </div>
          <div className="flex-1">
            <p className="font-sans text-[11px] font-bold text-yellow uppercase tracking-[0.2em] mb-4">Inside, you'll unlock:</p>
            <div className="space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="text-blue mt-1 flex-shrink-0">&rarr;</span>
                  <div>
                    <span className="font-sans text-[14px] font-bold text-cream">{p.title}:</span>
                    <span className="font-sans text-[14px] text-white/50"> {p.desc}</span>
                    <span className="font-sans text-[13px] text-yellow font-semibold"> ({p.value})</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-blue mt-1 flex-shrink-0">&rarr;</span>
                <div>
                  <span className="font-sans text-[14px] font-bold text-cream">Daily Q&A Channel:</span>
                  <span className="font-sans text-[14px] text-white/50"> Never get stuck. Get answers from the community and our team every single day.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 8: PRICING — The Showstopper
   ═══════════════════════════════════════════════════════════ */
function Pricing() {
  const valueItems = [
    { name: '6 Live Sessions with Dickie Bush, Nicolas Cole & Daniel Bustamante', price: '$4,200' },
    { name: 'Session Replays + Slide Decks', price: '$200' },
    { name: 'Digital Product Templates Pack', price: '$99' },
    { name: 'BONUS: Product Idea Extraction Prompt', price: '$99' },
    { name: 'BONUS: Template Swipe File', price: '$149' },
    { name: 'BONUS: Course Outline AI Prompt', price: '$99' },
    { name: 'BONUS: Landing Page Copy Templates', price: '$149' },
    { name: 'BONUS: Evergreen Marketing Playbook', price: '$99' },
    { name: 'BONUS: Revenue Tracker Spreadsheet', price: '$99' },
    { name: '30-Day AI Writing Skool Trial', price: '$99' },
  ]

  return (
    <section className="bg-black py-20 md:py-32 px-5 md:px-6">
      <div className="max-w-page mx-auto text-center">
        <p className="font-sans text-[11px] text-blue uppercase tracking-[0.2em] mb-3">Join The Bootcamp</p>
        <h2 className="font-display text-[clamp(32px,5vw,56px)] text-white uppercase leading-[0.95] mb-12">
          Proven Frameworks.<br />Everything You Need.
        </h2>

        {/* Pricing card */}
        <div className="max-w-[520px] mx-auto rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(249,227,93,0.08)]">
          {/* Top: value stack */}
          <div className="bg-dark border border-white/10 border-b-0 rounded-t-2xl p-6 md:p-8 text-left">
            {valueItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-b-0">
                <span className="font-sans text-[13px] text-white/60">{item.name}</span>
                <span className="font-sans text-[13px] text-white/50 flex-shrink-0 ml-4">{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/10">
              <span className="font-sans text-[13px] font-bold text-white">Total Value</span>
              <span className="font-sans text-[20px] font-bold text-white line-through">$5,293</span>
            </div>
          </div>

          {/* Bottom: price reveal */}
          <div className="bg-yellow rounded-b-2xl p-6 md:p-8 text-center">
            <p className="font-sans text-[11px] font-bold text-black/50 uppercase tracking-widest">Your Price</p>
            <p className="font-display text-[clamp(56px,10vw,80px)] text-black leading-none mt-2">$800</p>
            <a
              href={DEFAULT_CTA_URL}
              className="inline-block bg-black text-yellow font-sans text-[15px] font-bold uppercase tracking-[0.08em] px-16 py-4 rounded-lg mt-6 hover:bg-dark transition-all hover:scale-[1.02]"
            >
              Join Low-Ticket Launchpad LIVE
            </a>
            <p className="font-sans text-[12px] text-black/40 mt-4">7-day money-back guarantee</p>
          </div>
        </div>

        <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mt-8">Enrollment ends in</p>
        <CountdownTimer targetDate={CART_CLOSE_DATE} centered variant="yellow" />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 9: GUARANTEE + FINAL CTA
   ═══════════════════════════════════════════════════════════ */
function GuaranteeFinalCta() {
  return (
    <section className="bg-dark py-16 md:py-20 px-5 md:px-6">
      <div className="max-w-page mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Guarantee */}
          <div className="border-l-4 border-blue pl-6">
            <p className="font-sans text-[11px] font-bold text-blue uppercase tracking-[0.2em] mb-3">First-Week Guarantee</p>
            <h3 className="font-display text-[24px] text-cream uppercase mb-4">7-Day Money-Back Guarantee</h3>
            <p className="font-sans text-[14px] text-white/45 leading-relaxed">
              If in the first session of the bootcamp you show up,
              do the work, and decide this isn't what you expected &mdash;
              just let us know within 7 days and
              we'll give you a full refund.
              No questions asked.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="text-center md:text-left">
            <h2 className="font-display text-[clamp(32px,5vw,48px)] text-cream uppercase leading-[0.95] mb-6">
              Ready To Build?
            </h2>
            <a
              href={DEFAULT_CTA_URL}
              className="inline-block bg-yellow text-black font-sans text-[15px] font-bold uppercase tracking-[0.08em] px-12 py-4 rounded-lg hover:bg-yellow/90 transition-all hover:scale-[1.02] mb-4"
            >
              Join Low-Ticket Launchpad LIVE &mdash; $800 &rarr;
            </a>
            <p className="font-sans text-[14px] text-white/40 mt-4">
              Starting Monday, April 27th
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION 10: FAQ — Clean Accordion
   ═══════════════════════════════════════════════════════════ */
function FAQ() {
  const faqs = [
    { q: "How much time do I need per week?", a: "Three 60-minute live sessions per week (Monday, Wednesday, Friday), plus 1\u20132 hours to implement between sessions. Intensive but doable \u2014 every deliverable is built during the session itself, so implementation time is minimal." },
    { q: "What if I can't attend live?", a: "Every session is recorded and the replay goes up quickly after the live ends. You'll also get the full slide deck. Showing up live is where the real value is \u2014 real-time Q&A can't be replicated in a replay." },
    { q: "Do I need an existing audience?", a: "No. Inside the bootcamp we walk you through the exact social content strategy we use to organically generate sales. If you have an audience, you'll monetize faster. If you don't, you'll learn the systems to start generating traffic and sales from scratch." },
    { q: "What kind of digital product will I build?", a: "In the first week, you'll build a $99 template \u2014 a simple, actionable digital asset that solves one specific problem. In the second week, you'll expand that into a $350 digital course with a full offer stack and bonus bundle." },
    { q: "I already have a digital product. Is this still for me?", a: "Absolutely. If you've tried creating a digital product before but didn't see results, the bootcamp will help you identify what went wrong and how to fix it. We've made all the same mistakes most creators make \u2014 the difference is we've figured out how to fix them." },
    { q: "How is this different from the self-paced Low-Ticket Launchpad?", a: "The self-paced LTL is a bundle of mini-courses you work through on your own. Low-Ticket Launchpad Live is a 2-week live cohort where you build everything in real time with Dickie, Nicolas, and Daniel. Different format, much higher accountability \u2014 and you leave with a finished product." },
    { q: "Can't I just learn this for free?", a: "You could piece together snippets of information from across the internet and try to figure it all out yourself. But that would take hundreds of hours, and you'd still miss critical pieces. What we're offering is a complete, proven system that has generated over $15,000,000 in revenue." },
    { q: "Is there a VIP option?", a: "Yes. A small-group VIP upgrade is available at $2,500 \u2014 direct access and personalized strategy from Dickie, Nicolas, and Daniel. Limited spots. Email us to inquire." },
    { q: "How long do I have access?", a: "Lifetime. All replays, slide decks, templates, prompts, and bonuses are yours to keep forever." },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-black py-16 md:py-24 px-5 md:px-6">
      <div className="max-w-page mx-auto">
        <h2 className="font-display text-[clamp(28px,4vw,40px)] text-cream uppercase leading-[0.95] mb-10">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-white/5">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer"
              >
                <span className={`font-sans text-[16px] md:text-[18px] font-medium pr-4 transition-colors ${open === i ? 'text-yellow' : 'text-cream'}`}>{faq.q}</span>
                <span className={`text-[20px] flex-shrink-0 ${open === i ? 'text-blue' : 'text-white/30'}`}>{open === i ? '\u2212' : '+'}</span>
              </button>
              {open === i && (
                <p className="font-sans text-[14px] text-white/50 leading-relaxed pb-5 pr-8">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="font-sans text-[13px] text-white/20">&copy; 2026 Low-Ticket Launchpad. All rights reserved</p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   APP — Main Layout
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const heroCtaRef = useRef<HTMLAnchorElement | null>(null)

  return (
    <main className="min-h-screen">
      <Hero ctaRef={heroCtaRef} />
      <CredibilityBanner />
      <FadeIn><HowItWorks /></FadeIn>
      <FadeIn><Instructors /></FadeIn>
      <FadeIn><RightForYou /></FadeIn>
      <FadeIn><SessionRoadmap /></FadeIn>
      <FadeIn><Bonuses /></FadeIn>
      <FadeIn><AIWritingSkool /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><GuaranteeFinalCta /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <StickyCtaBar heroCtaRef={heroCtaRef} />
    </main>
  )
}
