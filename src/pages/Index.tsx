import { useEffect, useRef, useState } from 'react'
import '../App.css'

/* ── data ─────────────────────────────────────────────── */
const topics = [
  {
    id: '01', label: 'Co to jest AI?',
    desc: 'Fundament wiedzy — od historii do współczesności.',
  },
  {
    id: '02', label: 'Bankowość & Cyberbezpieczeństwo',
    desc: 'Jak AI chroni i transformuje sektor finansowy.',
  },
  {
    id: '03', label: 'AI w Edukacji',
    desc: 'Personalizacja nauki i przyszłość szkół.',
  },
  {
    id: '04', label: 'AI w Biznesie',
    desc: 'Automatyzacja, dane i przewaga konkurencyjna.',
  },
  {
    id: '05', label: 'AI w Kosmosie i Nauce',
    desc: 'Odkrywanie wszechświata z pomocą algorytmów.',
  },
  {
    id: '06', label: 'AI w Kulturze i Mediach',
    desc: 'Kreatywność, generatywne media i sztuka.',
  },
  {
    id: '07', label: 'AI w Medycynie',
    desc: 'Diagnostyka, genomika i leki przyszłości.',
  },
]

const whyItems = [
  {
    num: '01',
    title: 'Eksperci, nie slajdy',
    desc: 'Żywe panele z praktykami AI — ludźmi, którzy wdrażają technologię, nie tylko o niej mówią. Zero teorii, sto procent wartości.',
  },
  {
    num: '02',
    title: 'Kontakty na lata',
    desc: 'Kameralna formuła w górskiej scenerii sprzyja prawdziwym rozmowom. Tu poznasz ludzi, z którymi będziesz budować przyszłość.',
  },
  {
    num: '03',
    title: 'Platforma dla młodych',
    desc: 'Dedykowana strefa mentoringu dla studentów i juniorów. Wiedza, kontakty i realne szanse — bo przyszłość AI zaczyna się od Ciebie.',
  },
  {
    num: '04',
    title: 'Mówisz, nie słuchasz',
    desc: 'Siedem paneli otwartych na dyskusję. Każdy uczestnik ma głos — bo najlepsze pomysły rodzą się w dialogu, nie w monologu.',
  },
]

const EVENT_DATE = new Date('2026-06-11T09:00:00')

function getRemaining() {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}
function pad(n: number) { return String(n).padStart(2, '0') }

function useCountdown() {
  const [time, setTime] = useState(() => getRemaining())
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── smooth cursor ─────────────────────────────────────── */
function useSmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.10
      ring.current.y += (mouse.current.y - ring.current.y) * 0.10
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px,${mouse.current.y - 4}px)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x - 22}px,${ring.current.y - 22}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return { dotRef, ringRef, mouse }
}

/* ── parallax ──────────────────────────────────────────── */
function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e: MouseEvent) => setP({
      x: (e.clientX / window.innerWidth - 0.5) * 28,
      y: (e.clientY / window.innerHeight - 0.5) * 18,
    })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return p
}

/* ── scroll reveal ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ── component ─────────────────────────────────────────── */
export default function Index() {
  const [hovered, setHovered] = useState<number | null>(null)
  const { dotRef, ringRef } = useSmoothCursor()
  const p = useParallax()
  const countdown = useCountdown()
  const [loading, setLoading] = useState(true)
  useReveal()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-content">
          <div className="loader-ring" />
          <p className="loader-text">AI Beyond Intelligence</p>
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="shell page-enter">
      {/* cursor */}
      <div ref={dotRef} className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />

      {/* bg */}
      <div className="hero-bg" style={{ transform: `translate(${p.x * 0.6}px, ${p.y * 0.6}px)` }} />
      <div className="hero-overlay" />

      {/* orbs */}
      <div className="orb orb-1" style={{ transform: `translate(${p.x * 1.2}px, ${p.y * 1.2}px)` }} />
      <div className="orb orb-2" style={{ transform: `translate(${p.x * -0.8}px, ${p.y * -0.8}px)` }} />

      {/* ══ HERO ══ */}
      <section className="hero">
        <p className="eyebrow hero-anim hero-anim-1">Erste Bank presents</p>
        <h1 className="title hero-anim hero-anim-2">
          AI Beyond<br /> Intelligence
        </h1>
        <div className="hero-accent-line hero-anim hero-anim-3" />
        <p className="location-tag hero-anim hero-anim-3">
          <span className="loc-icon">▲</span>
          Konferencja na górze · Warszawa · 11 czerwca 2026
        </p>

        <div className="countdown hero-anim hero-anim-4">
          {([['dni', countdown.d], ['godz', countdown.h], ['min', countdown.m], ['sek', countdown.s]] as const).map(([lbl, val]) => (
            <div className="cd-cell" key={lbl}>
              <span className="cd-val">{pad(val as number)}</span>
              <span className="cd-lbl">{lbl}</span>
            </div>
          ))}
        </div>

        <div className="hero-actions hero-anim hero-anim-5">
          <a href="https://example.com/rejestracja" className="cta cta-primary">Zarejestruj się</a>
          <a href="#program" className="cta cta-ghost">Zobacz program</a>
        </div>

        <div className="hero-scroll-hint hero-anim hero-anim-6">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <span>Przewiń</span>
        </div>
      </section>

      {/* ══ PROGRAM ══ */}
      <section id="program" className="section" data-reveal>
        <p className="section-label">Program</p>
        <h2 className="section-title">7 paneli. Jedna wizja.</h2>
        <ul className="topics">
          {topics.map((t, i) => (
            <li
              key={t.id}
              className={hovered !== null && hovered !== i ? 'dim' : ''}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="num">{t.id}</span>
              <div className="topic-body">
                <span className="topic-name">{t.label}</span>
                <span className="topic-desc">{t.desc}</span>
              </div>
              <span className="arrow">→</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ WHY ══ */}
      <section className="section" data-reveal>
        <p className="section-label">Dlaczego warto</p>
        <h2 className="section-title">
          Zaprojektowane<br /> inaczej.
        </h2>
        <div className="why-grid">
          {whyItems.map((w, i) => (
            <div key={w.num} className="why-card" data-reveal style={{ '--wi': i } as React.CSSProperties}>
              <span className="why-num">{w.num}</span>
              <h3 className="why-title">{w.title}</h3>
              <p className="why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ REGISTER CTA BAND ══ */}
      <div className="cta-band" data-reveal>
        <div className="cta-band-inner">
          <p className="cta-band-label">Dołącz do nas</p>
          <h2 className="cta-band-title">Liczba miejsc jest ograniczona.</h2>
          <a href="https://example.com/rejestracja" className="cta cta-primary cta-large">Zarejestruj się →</a>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <span>© 2026 AI Beyond Intelligence</span>
        <span>Erste Bank</span>
      </footer>
    </div>
  )
}
