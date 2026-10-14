import { useEffect, useMemo, useState } from 'react'

type Task = { id: string; text: string; done: boolean }
type TaskMap = Record<string, Task[]>

const LS_KEY = 'insideout.tasks.v1'
const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function toISO(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

function mondayOf(dateISO: string) {
  const d = new Date(dateISO + 'T00:00:00')
  const shift = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - shift)
  return d
}

function formatLong(dateISO: string) {
  return new Date(dateISO + 'T00:00:00').toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function load(): TaskMap {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskMap>(load)
  const [selected, setSelected] = useState(() => toISO(new Date()))
  const [draft, setDraft] = useState('')

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks))
  }, [tasks])

  const dayTasks = tasks[selected] || []
  const doneCount = dayTasks.filter((t) => t.done).length
  const percent = dayTasks.length ? Math.round((doneCount / dayTasks.length) * 100) : 0

  const week = useMemo(() => {
    const mon = mondayOf(selected)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon)
      d.setDate(mon.getDate() + i)
      const iso = toISO(d)
      const list = tasks[iso] || []
      const done = list.filter((t) => t.done).length
      return {
        iso,
        label: DAY_NAMES[i],
        dayNum: d.getDate(),
        total: list.length,
        pct: list.length ? Math.round((done / list.length) * 100) : 0,
        isToday: iso === toISO(new Date()),
      }
    })
  }, [selected, tasks])

  const addTask = () => {
    const text = draft.trim()
    if (!text) return
    setTasks((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), { id: crypto.randomUUID(), text, done: false }],
    }))
    setDraft('')
  }

  const toggle = (id: string) =>
    setTasks((prev) => ({
      ...prev,
      [selected]: (prev[selected] || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }))

  const remove = (id: string) =>
    setTasks((prev) => ({
      ...prev,
      [selected]: (prev[selected] || []).filter((t) => t.id !== id),
    }))

  return (
    <main className="min-h-[100svh] bg-[#f7f5ee] pb-24 pt-28 text-[#141714]">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* заголовок */}
        <p className="rise-in mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#5f916c]">
          <span className="inline-block h-px w-10 bg-[#5f916c]" />
          Задачи
        </p>
        <h1 className="font-display rise-in rise-in-1 text-4xl font-extrabold sm:text-5xl">
          План на <span className="text-[#5f916c]">день</span>
        </h1>
        <p className="rise-in rise-in-2 mt-4 max-w-lg leading-relaxed text-[#141714]/60">
          Выбери день, запиши задачи и отмечай выполненные. Прогресс за неделю
          покажет, как растёт твоя продуктивность.
        </p>

        {/* неделя */}
        <div className="rise-in rise-in-3 mt-12 grid grid-cols-7 gap-2 sm:gap-3">
          {week.map((d) => (
            <button
              key={d.iso}
              onClick={() => setSelected(d.iso)}
              className={`group relative flex flex-col items-center rounded-2xl border px-1 py-3 transition-all duration-300 sm:py-4 ${
                selected === d.iso
                  ? 'border-[#5f916c] bg-[#5f916c] text-white shadow-lg shadow-[#5f916c]/25'
                  : 'border-[#141714]/10 bg-white/60 text-[#141714] hover:border-[#5f916c]/50 hover:bg-white'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider ${selected === d.iso ? 'text-white/70' : 'text-[#141714]/45'}`}>
                {d.label}
              </span>
              <span className="font-display mt-1 text-xl font-extrabold sm:text-2xl">{d.dayNum}</span>
              <span className="mt-1.5 flex h-1.5 items-center">
                {d.total > 0 && (
                  <span className={`h-1.5 w-1.5 rounded-full ${selected === d.iso ? 'bg-white' : 'bg-[#5f916c]'}`} />
                )}
              </span>
              {d.isToday && selected !== d.iso && (
                <span className="absolute -top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#5f916c]" />
              )}
            </button>
          ))}
        </div>

        {/* выбранный день */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#141714]/5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141714]/8 px-6 py-5 sm:px-8">
            <div>
              <h2 className="font-display text-xl font-extrabold capitalize sm:text-2xl">{formatLong(selected)}</h2>
              <p className="mt-1 text-sm text-[#141714]/50">
                {dayTasks.length === 0
                  ? 'Пока пусто — добавь первую задачу'
                  : `${doneCount} из ${dayTasks.length} выполнено`}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#141714]/60">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <input
                type="date"
                value={selected}
                onChange={(e) => e.target.value && setSelected(e.target.value)}
                className="cursor-pointer rounded-lg border border-[#141714]/15 bg-transparent px-2.5 py-1.5 text-sm font-semibold outline-none transition-colors focus:border-[#5f916c]"
              />
            </label>
          </div>

          {/* прогресс дня */}
          {dayTasks.length > 0 && (
            <div className="border-b border-[#141714]/8 px-6 py-4 sm:px-8">
              <div className="h-2 overflow-hidden rounded-full bg-[#141714]/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5f916c] to-[#8fc79b] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-bold text-[#5f916c]">{percent}%</p>
            </div>
          )}

          {/* список */}
          <ul className="divide-y divide-[#141714]/6">
            {dayTasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#f7f5ee]/60 sm:px-8">
                <input type="checkbox" className="task-check" checked={t.done} onChange={() => toggle(t.id)} />
                <span
                  className={`flex-1 text-[15px] font-medium transition-all duration-300 ${
                    t.done ? 'text-[#141714]/35 line-through decoration-[#5f916c]/60' : 'text-[#141714]'
                  }`}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  aria-label="Удалить задачу"
                  className="rounded-lg p-2 text-[#141714]/25 opacity-0 transition-all duration-300 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </li>
            ))}
            {dayTasks.length === 0 && (
              <li className="px-6 py-14 text-center text-[#141714]/35 sm:px-8">
                <svg className="mx-auto mb-4 text-[#5f916c]/40" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22V8" /><path d="M12 8C12 4 9 2 5 2c0 4 3 6 7 6Z" /><path d="M12 14c0-4 3-6 7-6 0 4-3 6-7 6Z" />
                </svg>
                Свободный день — или отличное время что-то запланировать
              </li>
            )}
          </ul>

          {/* форма */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addTask()
            }}
            className="flex gap-3 border-t border-[#141714]/8 bg-[#f7f5ee]/50 px-6 py-5 sm:px-8"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Например, повторить билеты по матанализу"
              maxLength={80}
              className="flex-1 rounded-xl border border-[#141714]/12 bg-white px-4 py-3 text-[15px] font-medium outline-none transition-colors placeholder:text-[#141714]/35 focus:border-[#5f916c]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#5f916c] px-6 py-3 font-bold text-white transition-all duration-300 hover:bg-[#6ea67c] disabled:opacity-40"
              disabled={!draft.trim()}
            >
              Добавить
            </button>
          </form>
        </div>

        {/* прогресс недели */}
        <div className="mt-10 rounded-3xl bg-[#141714] p-6 text-white sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold sm:text-2xl">Прогресс за неделю</h3>
              <p className="mt-1 text-sm text-white/50">Доля выполненных задач по дням</p>
            </div>
            <span className="font-display text-3xl font-extrabold text-[#8fc79b]">
              {Math.round(week.reduce((a, d) => a + d.pct, 0) / 7)}%
            </span>
          </div>
          <div className="mt-8 grid grid-cols-7 items-end gap-2 sm:gap-4" style={{ height: 160 }}>
            {week.map((d) => (
              <button
                key={d.iso}
                onClick={() => setSelected(d.iso)}
                className="flex h-full flex-col items-center justify-end gap-2"
                title={`${d.label}: ${d.pct}%`}
              >
                <span className="text-[11px] font-bold text-[#8fc79b]">{d.total > 0 ? `${d.pct}%` : ''}</span>
                <div className="flex w-full flex-1 items-end overflow-hidden rounded-t-lg bg-white/8">
                  <div className="week-fill w-full" style={{ height: `${d.pct}%` }} />
                </div>
                <span className={`text-xs font-bold uppercase ${selected === d.iso ? 'text-white' : 'text-white/40'}`}>
                  {d.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#141714]/35">
          Задачи хранятся локально в этом браузере
        </p>
      </div>
    </main>
  )
}
