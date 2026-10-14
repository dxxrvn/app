import { useEffect, useRef, useState, type ReactElement } from 'react'

type Phase = 'setup' | 'work' | 'break'
type SoundId = 'music' | 'rain' | 'nature'

const SOUNDS: { id: SoundId; label: string; src: string; icon: ReactElement }[] = [
  {
    id: 'music',
    label: 'Lo-fi музыка',
    src: '/media/music.mp3',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 'rain',
    label: 'Дождь',
    src: '/media/rain.mp3',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" /><path d="M8 19v2M12 18v3M16 19v2" />
      </svg>
    ),
  },
  {
    id: 'nature',
    label: 'Лес и птицы',
    src: '/media/nature.mp3',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V8" /><path d="M12 8C12 4 9 2 5 2c0 4 3 6 7 6Z" /><path d="M12 14c0-4 3-6 7-6 0 4-3 6-7 6Z" />
      </svg>
    ),
  },
]

function format(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function chime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.18 + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 1.4)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.18)
      osc.stop(ctx.currentTime + i * 0.18 + 1.5)
    })
    setTimeout(() => ctx.close(), 2500)
  } catch {
    /* звук недоступен — не критично */
  }
}

export default function Focus() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [workMin, setWorkMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [paused, setPaused] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeSounds, setActiveSounds] = useState<Set<SoundId>>(new Set())

  const audioRefs = useRef<Partial<Record<SoundId, HTMLAudioElement>>>({})
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = (msg: string) => {
    clearTimeout(toastTimer.current)
    setToast(null)
    requestAnimationFrame(() => {
      setToast(msg)
      toastTimer.current = setTimeout(() => setToast(null), 6200)
    })
    chime()
  }

  // тиканье таймера
  useEffect(() => {
    if (phase === 'setup' || paused) return
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, paused, secondsLeft])

  // смена фазы
  useEffect(() => {
    if (phase === 'setup' || secondsLeft > 0) return
    if (phase === 'work') {
      setPhase('break')
      setSecondsLeft(breakMin * 60)
      showToast('Время сделать небольшой перерыв — потяниcь, выпей воды')
    } else {
      setPhase('work')
      setSecondsLeft(workMin * 60)
      showToast('Перерыв окончен — возвращаемся к делу')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase])

  const start = () => {
    const w = Math.max(1, workMin)
    setPhase('work')
    setSecondsLeft(w * 60)
    setPaused(false)
    showToast('Фокус-сессия началась. Удачной работы!')
  }

  const stop = () => {
    setPhase('setup')
    setPaused(false)
    Object.values(audioRefs.current).forEach((a) => a?.pause())
    setActiveSounds(new Set())
  }

  const toggleSound = (id: SoundId) => {
    if (!audioRefs.current[id]) {
      const a = new Audio(SOUNDS.find((s) => s.id === id)!.src)
      a.loop = true
      a.volume = 0.55
      audioRefs.current[id] = a
    }
    const audio = audioRefs.current[id]!
    setActiveSounds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        audio.pause()
      } else {
        next.add(id)
        audio.play().catch(() => {})
      }
      return next
    })
  }

  /* ---------- ЭКРАН НАСТРОЙКИ ---------- */
  if (phase === 'setup') {
    return (
      <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c241c_0%,#0e100e_65%)]" />
        <div className="breathe absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5f916c]/20 blur-3xl" />

        <div className="rise-in relative z-10 w-full max-w-xl pt-16">
          <p className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8fc79b]">
            <span className="inline-block h-px w-8 bg-[#8fc79b]" />
            Тайм-менеджмент
            <span className="inline-block h-px w-8 bg-[#8fc79b]" />
          </p>
          <h1 className="font-display text-center text-4xl font-extrabold text-white sm:text-5xl">
            Настрой свой <span className="text-[#8fc79b]">ритм</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-white/60">
            Введи время — и начинай. Во время сессии играет lo-fi видео,
            а сайт мягко напомнит, когда пора отдохнуть.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-5">
            <label className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors focus-within:border-[#8fc79b]/60">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Работа</span>
              <div className="mt-3 flex items-baseline gap-2">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={workMin}
                  onChange={(e) => setWorkMin(Math.min(180, Math.max(1, Number(e.target.value) || 1)))}
                  className="font-display w-full bg-transparent text-5xl font-extrabold text-white outline-none"
                />
                <span className="text-sm font-semibold text-white/45">мин</span>
              </div>
            </label>
            <label className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors focus-within:border-[#8fc79b]/60">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Перерыв</span>
              <div className="mt-3 flex items-baseline gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakMin}
                  onChange={(e) => setBreakMin(Math.min(60, Math.max(1, Number(e.target.value) || 1)))}
                  className="font-display w-full bg-transparent text-5xl font-extrabold text-white outline-none"
                />
                <span className="text-sm font-semibold text-white/45">мин</span>
              </div>
            </label>
          </div>

          <button
            onClick={start}
            className="pulse-ring mx-auto mt-10 block rounded-full bg-[#5f916c] px-14 py-5 text-lg font-bold text-white transition-transform duration-300 hover:scale-105 hover:bg-[#6ea67c]"
          >
            Старт
          </button>
          <p className="mt-6 text-center text-sm text-white/35">
            Классика: 25 минут работы и 5 минут отдыха
          </p>
        </div>
      </main>
    )
  }

  /* ---------- ЭКРАН СЕССИИ ---------- */
  const isBreak = phase === 'break'
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/lofi.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={`absolute inset-0 transition-colors duration-1000 ${isBreak ? 'bg-[#101a14]/70' : 'bg-[#0e100e]/60'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,12,10,0.75)_100%)]" />

      {/* уведомление */}
      {toast && (
        <div className="toast-in fixed left-1/2 top-20 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#141714]/85 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <span className="grid h-9 w-9 flex-shrink-0 place-content-center rounded-full bg-[#5f916c] text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </span>
            <p className="text-sm font-semibold leading-snug text-white">{toast}</p>
          </div>
        </div>
      )}

      {/* таймер */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-24">
        <p
          className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] transition-colors duration-1000 ${
            isBreak ? 'text-[#8fc79b]' : 'text-white/60'
          }`}
        >
          <span className={`inline-block h-2 w-2 rounded-full ${isBreak ? 'bg-[#8fc79b]' : 'bg-white/60'}`} />
          {isBreak ? 'Перерыв — отдохни' : 'Фокус — работаем'}
        </p>
        <div className="font-display mt-4 text-[26vw] font-extrabold leading-none text-white tabular-nums sm:text-[11rem] md:text-[13rem]">
          {format(secondsLeft)}
        </div>
        <p className="mt-2 text-white/45">
          {isBreak
            ? `следующая фокус-фаза — ${workMin} мин`
            : `перерыв через ${format(secondsLeft)} · длина ${breakMin} мин`}
        </p>

        <div className="mt-12 flex items-center gap-4">
          <button
            onClick={() => setPaused((p) => !p)}
            className="rounded-full border border-white/25 px-8 py-3.5 font-bold text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
          >
            {paused ? 'Продолжить' : 'Пауза'}
          </button>
          <button
            onClick={stop}
            className="rounded-full bg-white/10 px-8 py-3.5 font-bold text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white"
          >
            Завершить
          </button>
        </div>
      </div>

      {/* звуки */}
      <div className="relative z-10 mx-auto mb-10 flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 px-5">
        <span className="mr-1 text-xs font-bold uppercase tracking-[0.25em] text-white/40">Фон:</span>
        {SOUNDS.map((s) => {
          const on = activeSounds.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => toggleSound(s.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-all duration-300 ${
                on
                  ? 'border-[#8fc79b]/70 bg-[#5f916c]/80 text-white shadow-lg shadow-[#5f916c]/30'
                  : 'border-white/15 bg-white/5 text-white/65 hover:border-white/40 hover:text-white'
              }`}
            >
              {s.icon}
              {s.label}
              {on && <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
            </button>
          )
        })}
      </div>
    </main>
  )
}
