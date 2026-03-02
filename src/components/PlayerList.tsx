import { useNavigate } from 'react-router-dom'
import { Trash2, User, TrendingUp } from 'lucide-react'
import { Player, Match } from '../types'
import { calculatePlayerStats } from '../utils/stats'

interface PlayerListProps {
  players: Player[]
  matches: Match[]
  selectedPlayers: string[]
  onSelectPlayer: (ids: string[]) => void
  onDeletePlayer: (id: string) => void
}

function PlayerList({ players, matches, selectedPlayers, onSelectPlayer, onDeletePlayer }: PlayerListProps) {
  const navigate = useNavigate()

  const toggleSelectAll = () => {
    if (selectedPlayers.length === players.length) {
      onSelectPlayer([])
    } else {
      onSelectPlayer(players.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedPlayers.includes(id)) {
      onSelectPlayer(selectedPlayers.filter(i => i !== id))
    } else {
      onSelectPlayer([...selectedPlayers, id])
    }
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Нет добавленных игроков
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <input
          type="checkbox"
          checked={selectedPlayers.length === players.length && players.length > 0}
          onChange={toggleSelectAll}
          className="w-4 h-4"
        />
        <label className="text-sm text-gray-600">Выбрать все</label>
      </div>

      <div className="space-y-2">
        {players.map(player => {
          const stats = calculatePlayerStats(player, matches)
          
          return (
            <div
              key={player.id}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedPlayers.includes(player.id)}
                onChange={() => toggleSelect(player.id)}
                className="w-4 h-4"
              />
              
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/player/${player.id}`)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-600" />
                    <span className="font-semibold text-sm">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <TrendingUp size={14} />
                    <span>{stats.totalMatches} матчей</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Побед: {stats.totalWins}</span>
                  <span>Поражений: {stats.totalLosses}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeletePlayer(player.id)
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerList
