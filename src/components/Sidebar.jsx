import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  var location = useLocation()
  var currentPath = location.pathname

  var containerStyle = {
    width: '220px',
    minWidth: '220px',
    backgroundColor: '#F5F0E8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px 0',
    fontFamily: 'system-ui'
  }

  var listStyle = {
    display: 'flex',
    flexDirection: 'column'
  }

  var itemBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 400,
    borderBottom: '1px solid #E2DDD5',
    cursor: 'default'
  }

  var linkItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 400,
    borderBottom: '1px solid #E2DDD5',
    cursor: 'pointer',
    textDecoration: 'none'
  }

  var linkActiveItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 400,
    backgroundColor: '#2D5A3D',
    borderBottom: '1px solid #E2DDD5',
    cursor: 'pointer',
    textDecoration: 'none'
  }

  var numberStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: '#787774',
    marginRight: '10px'
  }

  var numberActiveStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: '#FFFFFF',
    marginRight: '10px'
  }

  var labelInactiveStyle = {
    color: '#1E2820'
  }

  var labelActiveStyle = {
    color: '#FFFFFF'
  }

  var projectsLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#1E2820',
    borderBottom: '1px solid #E2DDD5',
    cursor: 'pointer',
    textDecoration: 'none'
  }

  var projectsLinkActiveStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#FFFFFF',
    backgroundColor: '#2D5A3D',
    borderBottom: '1px solid #E2DDD5',
    cursor: 'pointer',
    textDecoration: 'none'
  }

  var aiPanelStyle = {
    backgroundColor: '#1E2820',
    borderRadius: '8px',
    padding: '14px',
    margin: '16px 20px 0 20px'
  }

  var aiLabelStyle = {
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#4A7C5F',
    marginBottom: '8px'
  }

  var aiSampleStyle = {
    fontSize: '13px',
    fontStyle: 'italic',
    color: '#F5F0E8',
    marginBottom: '12px'
  }

  var aiButtonStyle = {
    backgroundColor: '#CC6644',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '6px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  }

  // path: null means the calculator has not been built yet — placeholder only, not clickable
  var items = [
    { number: '01', label: 'Parking', path: '/parking' },
    { number: '02', label: 'FSI', path: null },
    { number: '03', label: 'Toilets', path: '/toilets' },
    { number: '04', label: 'Refuge', path: null },
    { number: '05', label: 'Open Space', path: null }
  ]

  function isItemActive(item) {
    if (item.path === null) {
      return false
    }
    if (item.path === '/parking' && currentPath === '/') {
      return true
    }
    return currentPath === item.path
  }

  return (
    <React.Fragment>
      <style>{'@media print { .dcpr-print-hide { display: none !important; } }'}</style>
      <div className="dcpr-print-hide" style={containerStyle}>
        <div style={listStyle}>
          <Link to="/home" style={currentPath === '/home' ? projectsLinkActiveStyle : projectsLinkStyle}>
            Projects
          </Link>
          {items.map(function (item) {
            var active = isItemActive(item)

            if (item.path === null) {
              return (
                <div key={item.number} style={itemBaseStyle}>
                  <span style={numberStyle}>{item.number}</span>
                  <span style={labelInactiveStyle}>{item.label}</span>
                </div>
              )
            }

            return (
              <Link key={item.number} to={item.path} style={active ? linkActiveItemStyle : linkItemStyle}>
                <span style={active ? numberActiveStyle : numberStyle}>{item.number}</span>
                <span style={active ? labelActiveStyle : labelInactiveStyle}>{item.label}</span>
              </Link>
            )
          })}
        </div>
        <div style={aiPanelStyle}>
          <div style={aiLabelStyle}>Ask DCPR AI</div>
          <div style={aiSampleStyle}>"What is the parking requirement for a mixed-use plot in R2?"</div>
          <div style={aiButtonStyle}>Ask a question &#8594;</div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Sidebar
