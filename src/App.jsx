import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Sidebar from './components/Sidebar.jsx'
import Parking from './calculators/Parking.jsx'
import Toilets from './calculators/Toilets.jsx'
import Home from './pages/Home.jsx'
import NewProject from './pages/NewProject.jsx'
import ProjectDashboard from './pages/ProjectDashboard.jsx'

function App() {
  var pageStyle = {
    backgroundColor: '#F5F0E8',
    minHeight: '100vh',
    fontFamily: 'system-ui'
  }

  var bodyRowStyle = {
    display: 'flex',
    flexDirection: 'row'
  }

  var contentStyle = {
    flex: 1,
    backgroundColor: '#F5F0E8',
    padding: '24px 32px'
  }

  return (
    <BrowserRouter>
      <div style={pageStyle}>
        <Nav />
        <div style={bodyRowStyle}>
          <Sidebar />
          <div style={contentStyle}>
            <Routes>
              <Route path="/" element={<Parking />} />
              <Route path="/parking" element={<Parking />} />
              <Route path="/toilets" element={<Toilets />} />
              <Route path="/home" element={<Home />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/project/:id" element={<ProjectDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
