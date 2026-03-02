import { useLocalStorage } from './useLocalStorage'
import { Player } from '../types'

export function usePlayers() {
  const [players, setPlayers] = useLocalStorage<Player[]>('tennis-players', [])

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player])
  }

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId ? { ...player, ...updates } : player
      )
    )
  }

  const deletePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId))
  }

  const deletePlayers = (playerIds: string[]) => {
    setPlayers(prev => prev.filter(player => !playerIds.includes(player.id)))
  }

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer,
    deletePlayers,
    setPlayers
  }
}
