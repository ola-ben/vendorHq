import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Orders from './pages/Orders'
import Automations from './pages/Automations'
import { getUser } from './lib/storage'

function RequireAuth({ children }) {
  const user = getUser()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/automations" element={<Automations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
