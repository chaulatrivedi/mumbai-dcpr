import React from 'react'

function Nav() {
  var navStyle = {
    height: '48px',
    backgroundColor: '#1E2820',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    fontFamily: 'system-ui'
  }

  var leftGroupStyle = {
    display: 'flex',
    alignItems: 'center'
  }

  var logoStyle = {
    color: '#CC6644',
    fontSize: '16px',
    marginRight: '8px'
  }

  var brandStyle = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#F5F0E8',
    marginRight: '10px'
  }

  var badgeStyle = {
    fontSize: '10px',
    fontWeight: 400,
    color: '#FFFFFF',
    backgroundColor: '#2D5A3D',
    borderRadius: '20px',
    padding: '2px 8px',
    marginRight: '32px'
  }

  var linkGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  }

  var linkActiveStyle = {
    fontSize: '12px',
    fontWeight: 400,
    color: '#F5F0E8'
  }

  var linkInactiveStyle = {
    fontSize: '12px',
    fontWeight: 400,
    color: '#787774'
  }

  var searchStyle = {
    backgroundColor: '#2D5A3D',
    color: '#9BB5BF',
    fontSize: '12px',
    padding: '5px 12px',
    borderRadius: '5px',
    marginLeft: '32px'
  }

  return (
    <div style={navStyle}>
      <div style={leftGroupStyle}>
        <span style={logoStyle}>&#9670;</span>
        <span style={brandStyle}>Mumbai DCPR</span>
        <span style={badgeStyle}>2034</span>
        <div style={linkGroupStyle}>
          <span style={linkActiveStyle}>Calculators</span>
          <span style={linkInactiveStyle}>Regulations</span>
          <span style={linkInactiveStyle}>Ask AI</span>
        </div>
      </div>
      <div style={searchStyle}>Search</div>
    </div>
  )
}

export default Nav
