import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { usePlayers } from '../hooks/usePlayers'
import { useMatches } from '../hooks/useMatches'
import { calculatePlayerStats } from '../utils/stats'

interface PlayerProfilePageProps {
  playersHook: ReturnType<typeof usePlayers>
  matchesHook: ReturnType<typeof useMatches>
}

function PlayerProfilePage({ playersHook, matchesHook }: PlayerProfilePageProps) {
  const { playerId } = useParams<{ playerId: string }>()
  const navigate = useNavigate()
  const { players } = playersHook
  const { matches } = matchesHook
  const [showMatches, setShowMatches] = useState(false)

  const player = players.find(p => p.id === playerId)
  
  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Игрок не найден</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            На главную
          </button>
        </div>
      </div>
    )
  }

  const stats = calculatePlayerStats(player, matches)
  const playerMatches = matches
    .filter(m => m.player1.playerId === player.id || m.player2.playerId === player.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours > 0) {
      return `${hours}ч ${minutes}м`
    }
    return `${minutes}м`
  }

  const winRate = stats.totalMatches > 0
    ? Math.round((stats.totalWins / stats.totalMatches) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto safe-top safe-bottom">
        <div className="bg-white shadow-sm px-4 py-3 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{player.name}</h1>
              <p className="text-sm text-gray-600">
                Создан {format(new Date(player.createdAt), 'dd.MM.yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <button
            onClick={() => navigate(`/analytics/${player.id}`)}
            className="w-full p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            Аналитика
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setShowMatches(!showMatches)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold">Список матчей игрока</span>
              {showMatches ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showMatches && (
              <div className="border-t">
                {playerMatches.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Нет матчей
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {playerMatches.map(match => {
                      const isPlayer1 = match.player1.playerId === player.id
                      const playerData = isPlayer1 ? match.player1 : match.player2
                      const opponentData = isPlayer1 ? match.player2 : match.player1
                      const won = playerData.score > opponentData.score && match.status === 'finished'

                      return (
                        <div
                          key={match.id}
                          onClick={() => navigate(`/record-match/${match.id}`)}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold">
                              vs {opponentData.playerName}
                            </div>
                            {match.status === 'finished' && (
                              <div className={`text-xs font-semibold ${won ? 'text-green-600' : 'text-red-600'}`}>
                                {won ? 'Победа' : 'Поражение'}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{format(new Date(match.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                            <span className="font-semibold">
                              {playerData.score} : {opponentData.score}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold mb-4">Статистика</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalMatches}</div>
                <div className="text-sm text-gray-600">Всего матчей</div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{winRate}%</div>
                <div className="text-sm text-gray-600">Процент побед</div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.totalWins}</div>
                <div className="text-sm text-gray-600">Побед</div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.totalLosses}</div>
                <div className="text-sm text-gray-600">Поражений</div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(stats.averageTempo)}с
                </div>
                <div className="text-sm text-gray-600">Средний темп</div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(stats.averageShots)}
                </div>
                <div className="text-sm text-gray-600">Средние удары</div>
              </div>

              <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {formatTime(stats.totalPlayTime)}
                </div>
                <div className="text-sm text-gray-600">Общее время игры</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfilePage
