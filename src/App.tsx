import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { usePlayers } from './hooks/usePlayers'
import { useMatches } from './hooks/useMatches'
import HomePage from './pages/HomePage'
import RecordMatchPage from './pages/RecordMatchPage'
import PlayerProfilePage from './pages/PlayerProfilePage'

function App() {
  const playersHook = usePlayers()
  const matchesHook = useMatches()

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              playersHook={playersHook} 
              matchesHook={matchesHook} 
            />
          } 
        />
        <Route 
          path="/record-match/:matchId" 
          element={
            <RecordMatchPage 
              playersHook={playersHook}
              matchesHook={matchesHook}
            />
          } 
        />
        <Route 
          path="/player/:playerId" 
          element={
            <PlayerProfilePage 
              playersHook={playersHook}
              matchesHook={matchesHook}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
