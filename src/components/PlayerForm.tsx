import { useState } from 'react'

interface PlayerFormProps {
  onSubmit: (name: string) => void
  onCancel: () => void
  initialName?: string
}

function PlayerForm({ onSubmit, onCancel, initialName = '' }: PlayerFormProps) {
  const [name, setName] = useState(initialName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="player-name" className="block text-sm font-medium text-gray-700 mb-1">
          Имя игрока
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Добавить
        </button>
      </div>
    </form>
  )
}

export default PlayerForm
