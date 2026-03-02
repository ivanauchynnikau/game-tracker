import { X } from 'lucide-react'
import { Player } from '../types'

interface PlayerSelectorProps {
  players: Player[]
  currentPlayer1Id: string
  currentPlayer2Id: string
  onSelectPlayer1: (playerId: string) => void
  onSelectPlayer2: (playerId: string) => void
  onClose: () => void
}

function PlayerSelector({
  players,
  currentPlayer1Id,
  currentPlayer2Id,
  onSelectPlayer1,
  onSelectPlayer2,
  onClose
}: PlayerSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Выбрать игроков</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Игрок 1
            </label>
            <select
              value={currentPlayer1Id}
              onChange={(e) => onSelectPlayer1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Игрок 2
            </label>
            <select
              value={currentPlayer2Id}
              onChange={(e) => onSelectPlayer2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerSelector
