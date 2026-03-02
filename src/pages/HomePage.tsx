import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Upload, Shuffle, Plus, Trash2 } from 'lucide-react'
import { usePlayers } from '../hooks/usePlayers'
import { useMatches } from '../hooks/useMatches'
import { Match, Player } from '../types'
import { exportData, downloadJSON, importData, readFileAsText } from '../utils/exportImport'
import { generateRandomMatch } from '../utils/stats'
import MatchList from '../components/MatchList'
import PlayerList from '../components/PlayerList'
import Modal from '../components/Modal'
import PlayerForm from '../components/PlayerForm'

interface HomePageProps {
  playersHook: ReturnType<typeof usePlayers>
  matchesHook: ReturnType<typeof useMatches>
}

function HomePage({ playersHook, matchesHook }: HomePageProps) {
  const { players, addPlayer, deletePlayers } = playersHook
  const { matches, addMatch, deleteMatches, deleteMatchesByPlayer, setMatches } = matchesHook
  const [activeTab, setActiveTab] = useState<'matches' | 'players'>('matches')
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const navigate = useNavigate()

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await readFileAsText(file)
        const data = importData(text)
        
        const confirmed = window.confirm(
          `Импортировать ${data.players.length} игроков и ${data.matches.length} матчей? Текущие данные будут заменены.`
        )
        
        if (confirmed) {
          playersHook.setPlayers(data.players)
          setMatches(data.matches)
          alert('Данные успешно импортированы!')
        }
      } catch (error) {
        alert('Ошибка импорта: ' + (error as Error).message)
      }
    }
    input.click()
  }

  const handleExportAll = () => {
    const data = exportData(players, matches)
    const filename = `tennis-tracker-${new Date().toISOString().split('T')[0]}.json`
    downloadJSON(filename, data)
  }

  const handleExportSelected = () => {
    if (selectedMatches.length === 0) {
      alert('Выберите матчи для экспорта')
      return
    }
    
    const selectedMatchesData = matches.filter(m => selectedMatches.includes(m.id))
    const data = exportData(players, selectedMatchesData)
    const filename = `tennis-tracker-selected-${new Date().toISOString().split('T')[0]}.json`
    downloadJSON(filename, data)
  }

  const handleGenerateMatch = () => {
    if (players.length < 2) {
      alert('Добавьте минимум 2 игрока для генерации матча')
      return
    }
    
    const match = generateRandomMatch(players)
    if (match) {
      addMatch(match)
      navigate(`/record-match/${match.id}`)
    }
  }

  const handleCreateMatch = () => {
    if (players.length < 2) {
      alert('Добавьте минимум 2 игрока для создания матча')
      setActiveTab('players')
      setShowPlayerModal(true)
      return
    }
    
    const match = generateRandomMatch(players)
    if (match) {
      addMatch(match)
      navigate(`/record-match/${match.id}`)
    }
  }

  const handleDeleteSelectedMatches = () => {
    if (selectedMatches.length === 0) return
    
    const confirmed = window.confirm(`Удалить выбранные матчи (${selectedMatches.length})?`)
    if (confirmed) {
      deleteMatches(selectedMatches)
      setSelectedMatches([])
    }
  }

  const handleDeleteSelectedPlayers = () => {
    if (selectedPlayers.length === 0) return
    
    const matchesToDelete = matches.filter(m => 
      selectedPlayers.includes(m.player1.playerId) || 
      selectedPlayers.includes(m.player2.playerId)
    )
    
    const confirmed = window.confirm(
      `Удалить выбранных игроков (${selectedPlayers.length})? Это также удалит ${matchesToDelete.length} связанных матчей.`
    )
    
    if (confirmed) {
      selectedPlayers.forEach(playerId => deleteMatchesByPlayer(playerId))
      deletePlayers(selectedPlayers)
      setSelectedPlayers([])
    }
  }

  const handleAddPlayer = (name: string) => {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString()
    }
    addPlayer(player)
    setShowPlayerModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-2 py-2 safe-top safe-bottom">
        <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
          <div className="grid grid-cols-2 gap-2 mb-1">
            <button
              onClick={handleImport}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm"
            >
              <Upload size={18} />
              Импорт
            </button>
            <button
              onClick={handleGenerateMatch}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors text-sm"
            >
              <Shuffle size={18} />
              Сгенерировать матч
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportAll}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm"
            >
              <Download size={18} />
              Экспорт всех
            </button>
            <button
              onClick={handleExportSelected}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm"
            >
              <Download size={18} />
              Экспорт выбранных
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-2">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'matches'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Матчи
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'players'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Игроки
            </button>
          </div>

          <div className="p-2">
            {activeTab === 'matches' ? (
              <>
                {selectedMatches.length > 0 && (
                  <div className="mb-2">
                    <button
                      onClick={handleDeleteSelectedMatches}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-sm"
                    >
                      <Trash2 size={18} />
                      Удалить выбранные ({selectedMatches.length})
                    </button>
                  </div>
                )}
                <MatchList
                  matches={matches}
                  selectedMatches={selectedMatches}
                  onSelectMatch={setSelectedMatches}
                  onDeleteMatch={(id) => {
                    if (window.confirm('Удалить этот матч?')) {
                      matchesHook.deleteMatch(id)
                    }
                  }}
                />
              </>
            ) : (
              <>
                <div className="mb-2 flex gap-2">
                  <button
                    onClick={() => setShowPlayerModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm"
                  >
                    <Plus size={18} />
                    Добавить игрока
                  </button>
                  {selectedPlayers.length > 0 && (
                    <button
                      onClick={handleDeleteSelectedPlayers}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-sm"
                    >
                      <Trash2 size={18} />
                      Удалить ({selectedPlayers.length})
                    </button>
                  )}
                </div>
                <PlayerList
                  players={players}
                  matches={matches}
                  selectedPlayers={selectedPlayers}
                  onSelectPlayer={setSelectedPlayers}
                  onDeletePlayer={(id) => {
                    const playerMatches = matches.filter(
                      m => m.player1.playerId === id || m.player2.playerId === id
                    )
                    const confirmed = window.confirm(
                      `Удалить игрока? Это также удалит ${playerMatches.length} связанных матчей.`
                    )
                    if (confirmed) {
                      deleteMatchesByPlayer(id)
                      playersHook.deletePlayer(id)
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>

        {matches.length === 0 && activeTab === 'matches' && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4 text-sm">Нет записанных матчей</p>
          </div>
        )}

        <button
          onClick={handleCreateMatch}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
        >
          Запись нового матча
        </button>
      </div>

      <Modal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        title="Добавить игрока"
      >
        <PlayerForm
          onSubmit={handleAddPlayer}
          onCancel={() => setShowPlayerModal(false)}
        />
      </Modal>
    </div>
  )
}

export default HomePage
