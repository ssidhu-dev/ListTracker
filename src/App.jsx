import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'listtracker.items'

const STATUSES = ['want', 'in-progress', 'done']
const STATUS_META = {
  want: { label: 'Want', color: '#8e8ea0' },
  'in-progress': { label: 'In progress', color: '#ff9f0a' },
  done: { label: 'Done', color: '#30d158' },
}

const TYPES = ['book', 'show', 'movie', 'shopping']
const TYPE_META = {
  book: { label: 'Book', icon: '📖', color: '#ebc06d' },
  show: { label: 'Show', icon: '📺', color: '#52c8db' },
  movie: { label: 'Movie', icon: '🎬', color: '#ae94fa' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#5edc8c' },
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function App() {
  const [items, setItems] = useState(loadItems)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('book')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setItems((prev) => [
      { id: crypto.randomUUID(), title: trimmed, type, status: 'want' },
      ...prev,
    ])
    setTitle('')
  }

  function cycleStatus(id) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const nextIndex = (STATUSES.indexOf(item.status) + 1) % STATUSES.length
        return { ...item, status: STATUSES[nextIndex] }
      }),
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const visibleItems = items.filter((item) => {
    const statusMatch = statusFilter === 'all' || item.status === statusFilter
    const typeMatch = typeFilter === 'all' || item.type === typeFilter
    return statusMatch && typeMatch
  })

  const inProgressCount = items.filter((i) => i.status === 'in-progress').length

  return (
    <div className="app">
      <header className="page-header">
        <h1>List Tracker</h1>
        <p className="subtitle">
          {items.length === 0
            ? 'No items yet'
            : `${items.length} item${items.length === 1 ? '' : 's'} · ${inProgressCount} in progress`}
        </p>
      </header>

      <form className="add-form" onSubmit={addItem}>
        <div className="add-row">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Add a ${TYPE_META[type].label.toLowerCase()}...`}
          />
          <button type="submit" className="add-button" aria-label="Add item">
            +
          </button>
        </div>
        <div className="type-picker">
          {TYPES.map((t) => {
            const meta = TYPE_META[t]
            const selected = type === t
            return (
              <button
                type="button"
                key={t}
                className={`type-pill${selected ? ' selected' : ''}`}
                style={selected ? { borderColor: meta.color, color: meta.color } : undefined}
                onClick={() => setType(t)}
              >
                <span className="type-icon">{meta.icon}</span>
                {selected && <span>{meta.label}</span>}
              </button>
            )
          })}
        </div>
      </form>

      <div className="status-tabs">
        <button
          className={`status-tab${statusFilter === 'all' ? ' selected' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`status-tab${statusFilter === s ? ' selected' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {STATUS_META[s].label}
          </button>
        ))}
      </div>

      <div className="type-filters">
        <button
          className={`type-filter-pill${typeFilter === 'all' ? ' selected' : ''}`}
          onClick={() => setTypeFilter('all')}
        >
          All
        </button>
        {TYPES.map((t) => {
          const meta = TYPE_META[t]
          return (
            <button
              key={t}
              className={`type-filter-pill${typeFilter === t ? ' selected' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              <span className="type-icon">{meta.icon}</span>
              {meta.label}s
            </button>
          )
        })}
      </div>

      <ul className="item-list">
        {visibleItems.length === 0 && (
          <li className="empty">
            <div className="empty-icons">
              {TYPES.map((t) => (
                <span
                  key={t}
                  className="empty-icon-badge"
                  style={{ background: `${TYPE_META[t].color}33` }}
                >
                  {TYPE_META[t].icon}
                </span>
              ))}
            </div>
            <h2>Start your list</h2>
            <p>
              Add a book to read, a show or movie to watch, or something to buy. Tap an
              item to move it along.
            </p>
          </li>
        )}
        {visibleItems.map((item) => {
          const typeMeta = TYPE_META[item.type]
          const statusMeta = STATUS_META[item.status]
          return (
            <li key={item.id} className="item">
              <button className="item-main" onClick={() => cycleStatus(item.id)}>
                <span
                  className="item-badge"
                  style={{ background: `${typeMeta.color}33` }}
                >
                  {typeMeta.icon}
                </span>
                <span className="item-body">
                  <span className={`item-title${item.status === 'done' ? ' done' : ''}`}>
                    {item.title}
                  </span>
                  <span className="item-meta">
                    <span className="status-chip">
                      <span
                        className="status-dot"
                        style={{ background: statusMeta.color }}
                      />
                      <span style={{ color: statusMeta.color }}>{statusMeta.label}</span>
                    </span>
                    <span className="item-type-label">{typeMeta.label}</span>
                  </span>
                </span>
              </button>
              <button className="remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                ×
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
