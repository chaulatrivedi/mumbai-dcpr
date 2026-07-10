import React from 'react'

function Parking() {
  var cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '0.5px solid #E2DDD5',
    borderRadius: '8px',
    padding: '20px 24px',
    fontFamily: 'system-ui'
  }

  var titleStyle = {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1E2820'
  }

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>Parking</div>
    </div>
  )
}

export default Parking
