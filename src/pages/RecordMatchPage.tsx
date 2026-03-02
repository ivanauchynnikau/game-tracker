import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Square, Users } from 'lucide-react'
import { usePlayers } from '../hooks/usePlayers'
import { useMatches } from '../hooks/useMatches'
import { Match, Rally } from '../types'
import TennisCourt from '../components/TennisCourt'
import PlayerSelector from '../components/PlayerSelector'

interface RecordMatchPageProps {
  playersHook: ReturnType<typeof usePlayers>
  matchesHook: ReturnType<typeof useMatches>
}

function RecordMatchPage({ playersHook, matchesHook }: RecordMatchPageProps) {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const { players } = playersHook
  const { matches, updateMatch } = matchesHook

  const match = matches.find(m => m.id === matchId)
  
  const [currentRally, setCurrentRally] = useState<Rally | null>(null)
  const [rallyStartTime, setRallyStartTime] = useState<number | null>(null)
  const [showPlayerSelector, setShowPlayerSelector] = useState(false)

  useEffect(() => {
    if (!match) {
      navigate('/')
    }
  }, [match, navigate])

  if (!match) return null

  const isPlaying = match.status === 'playing' && currentRally !== null
  const isPaused = match.status === 'paused'

  const startRally = () => {
    const now = Date.now()
    setRallyStartTime(now)
    setCurrentRally({
      id: crypto.randomUUID(),
      startTime: new Date(now).toISOString(),
      endTime: '',
      duration: 0,
      winner: null
    })
  }

  const endRally = (winner: 'player1' | 'player2') => {
    if (!currentRally || !rallyStartTime) return

    const now = Date.now()
    const duration = now - rallyStartTime

    const completedRally: Rally = {
      ...currentRally,
      endTime: new Date(now).toISOString(),
      duration,
      winner
    }

    const updatedMatch: Partial<Match> = {
      rallies: [...match.rallies, completedRally],
      player1: {
        ...match.player1,
        score: winner === 'player1' ? match.player1.score + 1 : match.player1.score,
        shots: match.player1.shots + 1,
        tempo: calculateTempo([...match.rallies, completedRally], 'player1')
      },
      player2: {
        ...match.player2,
        score: winner === 'player2' ? match.player2.score + 1 : match.player2.score,
        shots: match.player2.shots + 1,
        tempo: calculateTempo([...match.rallies, completedRally], 'player2')
      },
      rallyTempo: calculateRallyTempo([...match.rallies, completedRally])
    }

    updateMatch(match.id, updatedMatch)
    setCurrentRally(null)
    setRallyStartTime(null)
  }

  const calculateTempo = (rallies: Rally[], player: 'player1' | 'player2'): number => {
    const wonRallies = rallies.filter(r => r.winner === player)
    if (wonRallies.length === 0) return 0
    const totalDuration = wonRallies.reduce((sum, r) => sum + r.duration, 0)
    return Math.round(totalDuration / wonRallies.length / 1000)
  }

  const calculateRallyTempo = (rallies: Rally[]): number => {
    if (rallies.length === 0) return 0
    const totalDuration = rallies.reduce((sum, r) => sum + r.duration, 0)
    return Math.round(totalDuration / rallies.length / 1000)
  }

  const togglePause = () => {
    if (match.status === 'paused') {
      updateMatch(match.id, { status: 'playing' })
    } else {
      updateMatch(match.id, { status: 'paused' })
    }
  }

  const finishMatch = () => {
    const confirmed = window.confirm('Завершить матч?')
    if (confirmed) {
      updateMatch(match.id, {
        status: 'finished',
        finishedAt: new Date().toISOString()
      })
      navigate('/')
    }
  }

  const changePlayer = (playerType: 'player1' | 'player2', newPlayerId: string) => {
    const newPlayer = players.find(p => p.id === newPlayerId)
    if (!newPlayer) return

    const updatedMatch: Partial<Match> = {
      [playerType]: {
        ...match[playerType],
        playerId: newPlayer.id,
        playerName: newPlayer.name
      }
    }

    updateMatch(match.id, updatedMatch)
    setShowPlayerSelector(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto safe-top safe-bottom">
        <div className="bg-white shadow-sm px-2 py-1 mb-1">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-semibold">Запись матча</h1>
            <button
              onClick={() => setShowPlayerSelector(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <button
                onClick={() => !isPlaying && endRally('player1')}
                disabled={!isPlaying}
                className="w-full min-h-[30px] px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold disabled:bg-gray-300 hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                {match.player1.playerName}
              </button>
              <div className="text-center">
                <div className="text-xl font-bold">{match.player1.score}</div>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => !isPlaying && endRally('player2')}
                disabled={!isPlaying}
                className="w-full min-h-[30px] px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold disabled:bg-gray-300 hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                {match.player2.playerName}
              </button>
              <div className="text-center">
                <div className="text-xl font-bold">{match.player2.score}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 flex flex-col gap-1">
          <div className="flex justify-between items-end pb-1 text-xs">
            <div className="text-gray-700">
              Темп {match.player1.playerName}: <span className="font-semibold">{match.player1.tempo}с</span>
            </div>
            <div className="text-gray-700">
              Темп {match.player2.playerName}: <span className="font-semibold">{match.player2.tempo}с</span>
            </div>
          </div>

          <TennisCourt />

          <div className="text-center pt-0">
            <div className="text-sm italic text-gray-700">
              Темп розыгрыша: <span className="font-normal">{match.rallyTempo}с</span>
            </div>
          </div>
        </div>

        <div className="px-2 mt-2 space-y-2">
          <div className="text-center text-sm text-gray-600">
            <div>Удары: {match.player1.shots + match.player2.shots}</div>
            <div>Розыгрышей: {match.rallies.length}</div>
          </div>

          {!isPlaying ? (
            <button
              onClick={startRally}
              disabled={isPaused}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 transition-colors"
            >
              <Play size={24} />
              Начать розыгрыш
            </button>
          ) : (
            <div className="text-center py-4 bg-yellow-100 rounded-lg">
              <div className="text-lg font-semibold text-yellow-800">
                Розыгрыш идет...
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                Нажмите на игрока, который выиграл розыгрыш
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 active:bg-yellow-800 transition-colors"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
              {isPaused ? 'Продолжить' : 'Пауза'}
            </button>
            <button
              onClick={finishMatch}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 active:bg-red-800 transition-colors"
            >
              <Square size={20} />
              Завершить
            </button>
          </div>
        </div>
      </div>

      {showPlayerSelector && (
        <PlayerSelector
          players={players}
          currentPlayer1Id={match.player1.playerId}
          currentPlayer2Id={match.player2.playerId}
          onSelectPlayer1={(id) => changePlayer('player1', id)}
          onSelectPlayer2={(id) => changePlayer('player2', id)}
          onClose={() => setShowPlayerSelector(false)}
        />
      )}
    </div>
  )
}

export default RecordMatchPage
