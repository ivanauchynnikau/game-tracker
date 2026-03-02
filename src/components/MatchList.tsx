import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Trash2, PlayCircle, CheckCircle2 } from 'lucide-react'
import { Match } from '../types'

interface MatchListProps {
  matches: Match[]
  selectedMatches: string[]
  onSelectMatch: (ids: string[]) => void
  onDeleteMatch: (id: string) => void
}

function MatchList({ matches, selectedMatches, onSelectMatch, onDeleteMatch }: MatchListProps) {
  const navigate = useNavigate()

  const toggleSelectAll = () => {
    if (selectedMatches.length === matches.length) {
      onSelectMatch([])
    } else {
      onSelectMatch(matches.map(m => m.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedMatches.includes(id)) {
      onSelectMatch(selectedMatches.filter(i => i !== id))
    } else {
      onSelectMatch([...selectedMatches, id])
    }
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Нет записанных матчей
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <input
          type="checkbox"
          checked={selectedMatches.length === matches.length && matches.length > 0}
          onChange={toggleSelectAll}
          className="w-4 h-4"
        />
        <label className="text-sm text-gray-600">Выбрать все</label>
      </div>

      <div className="space-y-2">
        {matches.map(match => (
          <div
            key={match.id}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedMatches.includes(match.id)}
              onChange={() => toggleSelect(match.id)}
              className="w-4 h-4"
            />
            
            <div
              className="flex-1 cursor-pointer"
              onClick={() => {
                if (match.status === 'finished') {
                  navigate(`/record-match/${match.id}`)
                } else {
                  navigate(`/record-match/${match.id}`)
                }
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-sm">
                  {match.player1.playerName} vs {match.player2.playerName}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {match.status === 'finished' ? (
                    <CheckCircle2 size={14} className="text-green-600" />
                  ) : (
                    <PlayCircle size={14} className="text-blue-600" />
                  )}
                  <span className="text-gray-600">
                    {match.status === 'finished' ? 'Завершен' : 'В процессе'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{format(new Date(match.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                <span className="font-semibold">
                  {match.player1.score} : {match.player2.score}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteMatch(match.id)
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchList
