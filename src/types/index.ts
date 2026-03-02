export interface Player {
  id: string
  name: string
  createdAt: string
}

export interface MatchPlayer {
  playerId: string
  playerName: string
  score: number
  tempo: number
  shots: number
}

export interface Rally {
  id: string
  startTime: string
  endTime: string
  duration: number
  winner: 'player1' | 'player2' | null
}

export interface Match {
  id: string
  createdAt: string
  player1: MatchPlayer
  player2: MatchPlayer
  isDouble: boolean
  rallies: Rally[]
  rallyTempo: number
  status: 'playing' | 'finished' | 'paused'
  finishedAt?: string
}

export interface PlayerStats {
  playerId: string
  playerName: string
  totalMatches: number
  totalWins: number
  totalLosses: number
  averageTempo: number
  averageShots: number
  totalPlayTime: number
}
