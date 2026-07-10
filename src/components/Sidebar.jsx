import React from 'react'

function Sidebar() {
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

  var activeItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 400,
    backgroundColor: '#2D5A3D',
    borderBottom: '1px solid #E2DDD5',
    cursor: 'default'
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

  var items = [
    { number: '01', label: 'Parking' },
    { number: '02', label: 'FSI' },
    { number: '03', label: 'Toilets' },
    { number: '04', label: 'Refuge' },
    { number: '05', label: 'Stairs' },
    { number: '06', label: 'Open Sp' },
    { number: '07', label: 'Lifts' }
  ]

  return (
    <div style={containerStyle}>
      <div style={listStyle}>
        {items.map(function (item, index) {
          if (index === 0) {
            return (
              <div key={item.number} style={activeItemStyle}>
                <span style={numberActiveStyle}>{item.number}</span>
                <span style={labelActiveStyle}>{item.label}</span>
              </div>
            )
          }
          return (
            <div key={item.number} style={itemBaseStyle}>
              <span style={numberStyle}>{item.number}</span>
              <span style={labelInactiveStyle}>{item.label}</span>
            </div>
          )
        })}
      </div>
      <div style={aiPanelStyle}>
        <div style={aiLabelStyle}>Ask DCPR AI</div>
        <div style={aiSampleStyle}>"What is the parking requirement for a mixed-use plot in R2?"</div>
        <div style={aiButtonStyle}>Ask a question &#8594;</div>
      </div>
    </div>
  )
}

export default Sidebar
