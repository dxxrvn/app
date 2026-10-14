import type { Page } from '../App'

const FEATURES: {
  title: string
  text: string
  cta: string
  page: Page
  num: string
}[] = [
  {
    num: '01',
    title: 'Фокус-сессия',
    text: 'Задай время работы — и погрузись. Lo-fi видео, мягкие уведомления о перерывах и звуки природы не дадут выгореть.',
    cta: 'Запустить таймер',
    page: 'focus',
  },
  {
    num: '02',
    title: 'План на день',
    text: 'Записывай задачи, отмечай выполненные и следи, как растёт твоя продуктивность за неделю.',
    cta: 'Составить план',
    page: 'tasks',
  },
  {
    num: '03',
    title: 'Спокойный ритм',
    text: 'Мы верим: продуктивность начинается не с давления, а с заботы о себе и понятного распорядка дня.',
    cta: 'Узнать больше',
    page: 'focus',
  },
]

export default function Home({ go }: { go: (p: Page) => void }) {
  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/media/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e100e] via-[#0e100e]/45 to-[#0e100e]/30" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-40 sm:px-8">
          <p className="rise-in mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8fc79b]">
            <span className="inline-block h-px w-10 bg-[#8fc79b]" />
            Inside Out · тайм-менеджмент
          </p>
          <h1 className="font-display rise-in rise-in-1 max-w-4xl text-5xl font-extrabold leading-[1.02] text-white sm:text-7xl md:text-8xl">
            Время работает,
            <br />
            когда ты <span className="text-[#8fc79b]">в ресурсе</span>
          </h1>
          <p className="rise-in rise-in-2 mt-7 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Помогаем школьникам и студентам организовывать учёбу без стресса:
            фокус-сессии под lo-fi, план на день и забота о ментальном здоровье.
          </p>
          <div className="rise-in rise-in-3 mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => go('focus')}
              className="pulse-ring rounded-full bg-[#5f916c] px-8 py-4 text-base font-bold text-white transition-transform duration-300 hover:scale-[1.04] hover:bg-[#6ea67c]"
            >
              Начать фокус-сессию
            </button>
            <button
              onClick={() => go('tasks')}
              className="rounded-full border border-white/30 px-8 py-4 text-base font-bold text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              План на день
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40">
          <svg width="22" height="34" viewBox="0 0 22 34" fill="none" className="mx-auto">
            <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="11" cy="10" r="2.5" fill="currentColor">
              <animate attributeName="cy" values="10;20;10" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="bg-[#f7f5ee] py-24 text-[#141714] sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#5f916c]">
            <span className="inline-block h-px w-10 bg-[#5f916c]" />
            Что внутри
          </p>
          <h2 className="font-display max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Всё для спокойной и продуктивной учёбы
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-[#141714]/10 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="group flex flex-col bg-[#f7f5ee] p-8 transition-colors duration-500 hover:bg-white sm:p-10"
              >
                <span className="font-display text-sm font-bold text-[#5f916c]/60">{f.num}</span>
                <h3 className="font-display mt-4 text-2xl font-extrabold">{f.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-[#141714]/65">{f.text}</p>
                <button
                  onClick={() => go(f.page)}
                  className="mt-8 inline-flex w-fit items-center gap-2 font-bold text-[#5f916c] transition-all duration-300 group-hover:gap-3.5"
                >
                  {f.cta}
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                    <path d="M1 6h15m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-[#0e100e] py-16 text-white/60">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:grid-cols-3 sm:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/media/logophoto.png" alt="" className="h-9 w-auto" />
              <img src="/media/logotext.png" alt="Inside Out" className="h-5 w-auto brightness-0 invert" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Проект про тайм-менеджмент и ментальное здоровье школьников и
              студентов. Учимся работать в своём темпе — без выгорания.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Разделы</h4>
            <ul className="mt-5 space-y-3 text-sm font-semibold">
              <li><button className="transition-colors hover:text-[#8fc79b]" onClick={() => go('home')}>Главная</button></li>
              <li><button className="transition-colors hover:text-[#8fc79b]" onClick={() => go('focus')}>Тайм-менеджмент</button></li>
              <li><button className="transition-colors hover:text-[#8fc79b]" onClick={() => go('tasks')}>Задачи</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Контакты</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>hello@insideout.study</li>
              <li>Москва, Россия</li>
              <li className="pt-2 text-white/35">Учебный проект · сделано с заботой</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 pt-8 text-xs text-white/35 sm:px-8">
          <span>© 2026 Inside Out. Все права защищены.</span>
          <span>Дыши. Планируй. Успевай.</span>
        </div>
      </footer>
    </main>
  )
}
