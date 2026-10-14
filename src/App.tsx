import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Focus from './pages/Focus'
import Tasks from './pages/Tasks'

export type Page = 'home' | 'focus' | 'tasks'

const NAV: { id: Page; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'focus', label: 'Тайм-менеджмент' },
  { id: 'tasks', label: 'Задачи' },
]

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [page])

  // на светлой странице «Задачи» навигация должна быть тёмной, пока шапка прозрачная
  const lightHeader = page === 'tasks' && !scrolled

  return (
    <div className="min-h-screen bg-[#0e100e]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl bg-[#0e100e]/70 border-b border-white/10'
            : 'backdrop-blur-0 bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 sm:px-8">
          <button
            onClick={() => setPage('home')}
            className="mr-4 flex items-center gap-2.5 transition-opacity hover:opacity-80"
            aria-label="Inside Out — на главную"
          >
            <img src="/media/logophoto.png" alt="" className="h-8 w-auto" />
            <img
              src="/media/logotext.png"
              alt="Inside Out"
              className={`h-5 w-auto transition-all duration-500 ${lightHeader ? '' : 'brightness-0 invert'}`}
            />
          </button>
          <div className="ml-auto flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 sm:text-[15px] ${
                  page === item.id
                    ? 'bg-[#5f916c] text-white'
                    : lightHeader
                      ? 'text-[#141714]/70 hover:bg-[#141714]/8 hover:text-[#141714]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {page === 'home' && <Home go={setPage} />}
      {page === 'focus' && <Focus />}
      {page === 'tasks' && <Tasks />}
    </div>
  )
}
