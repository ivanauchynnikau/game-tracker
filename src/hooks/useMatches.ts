import { useLocalStorage } from './useLocalStorage'
import { Match } from '../types'

export function useMatches() {
  const [matches, setMatches] = useLocalStorage<Match[]>('tennis-matches', [])

  const addMatch = (match: Match) => {
    setMatches(prev => [match, ...prev])
  }

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId ? { ...match, ...updates } : match
      )
    )
  }

  const deleteMatch = (matchId: string) => {
    setMatches(prev => prev.filter(match => match.id !== matchId))
  }

  const deleteMatches = (matchIds: string[]) => {
    setMatches(prev => prev.filter(match => !matchIds.includes(match.id)))
  }

  const deleteMatchesByPlayer = (playerId: string) => {
    setMatches(prev => prev.filter(match => 
      match.player1.playerId !== playerId && match.player2.playerId !== playerId
    ))
  }

  return {
    matches,
    addMatch,
    updateMatch,
    deleteMatch,
    deleteMatches,
    deleteMatchesByPlayer,
    setMatches
  }
}
