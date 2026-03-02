import { Match, Player, PlayerStats } from '../types'

export function calculatePlayerStats(player: Player, matches: Match[]): PlayerStats {
  const playerMatches = matches.filter(
    match => match.player1.playerId === player.id || match.player2.playerId === player.id
  )

  const finishedMatches = playerMatches.filter(match => match.status === 'finished')

  let totalWins = 0
  let totalTempo = 0
  let totalShots = 0
  let totalPlayTime = 0

  finishedMatches.forEach(match => {
    const isPlayer1 = match.player1.playerId === player.id
    const playerData = isPlayer1 ? match.player1 : match.player2
    const opponentData = isPlayer1 ? match.player2 : match.player1

    if (playerData.score > opponentData.score) {
      totalWins++
    }

    totalTempo += playerData.tempo
    totalShots += playerData.shots

    if (match.finishedAt) {
      const duration = new Date(match.finishedAt).getTime() - new Date(match.createdAt).getTime()
      totalPlayTime += duration
    }
  })

  return {
    playerId: player.id,
    playerName: player.name,
    totalMatches: finishedMatches.length,
    totalWins,
    totalLosses: finishedMatches.length - totalWins,
    averageTempo: finishedMatches.length > 0 ? totalTempo / finishedMatches.length : 0,
    averageShots: finishedMatches.length > 0 ? totalShots / finishedMatches.length : 0,
    totalPlayTime
  }
}

export function generateRandomMatch(players: Player[]): Match | null {
  if (players.length < 2) return null

  const shuffled = [...players].sort(() => Math.random() - 0.5)
  const player1 = shuffled[0]
  const player2 = shuffled[1]

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    player1: {
      playerId: player1.id,
      playerName: player1.name,
      score: 0,
      tempo: 0,
      shots: 0
    },
    player2: {
      playerId: player2.id,
      playerName: player2.name,
      score: 0,
      tempo: 0,
      shots: 0
    },
    isDouble: false,
    rallies: [],
    rallyTempo: 0,
    status: 'playing'
  }
}
