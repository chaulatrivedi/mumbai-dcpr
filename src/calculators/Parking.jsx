import React from 'react'
import { calcParking } from '../utils/parkingCalc.js'

function getMainTotal(result) {
  if (result.typology === 'school') {
    return result.grandTotal
  }
  return result.total
}

function getStats(result) {
  if (result.typology === 'residential') {
    return [
      { label: 'SUB-TOTAL', value: result.subTotal },
      { label: 'VISITOR', value: result.visitor },
      { label: 'TWO-WHEELER (OPT)', value: result.twoWheelerOptional }
    ]
  }
  if (result.typology === 'shopping_convenience') {
    return [
      { label: 'CARS', value: result.cars },
      { label: 'VISITOR', value: result.visitor },
      { label: 'TRANSPORT VEH', value: result.transportVehicle }
    ]
  }
  if (result.typology === 'mercantile' || result.typology === 'office') {
    return [
      { label: 'SUB-TOTAL', value: result.subTotal },
      { label: 'VISITOR', value: result.visitor },
      { label: 'TRANSPORT VEH', value: result.transportVehicle }
    ]
  }
  if (result.typology === 'school') {
    return [
      { label: 'ADMIN', value: result.admin.total },
      { label: 'ASSEMBLY', value: result.assembly.total },
      { label: 'CANTEEN', value: result.canteen.total }
    ]
  }
  return []
}

function getBreakdownRows(result) {
  var rows = []
  var i

  if (result.typology === 'residential') {
    for (i = 0; i < result.slabs.length; i = i + 1) {
      rows.push({ label: result.slabs[i].label, detail: result.slabs[i].count + ' tenements', cars: result.slabs[i].cars })
    }
  } else if (result.typology === 'shopping_convenience') {
    rows.push({ label: result.shopSizeCategory, detail: result.area + ' sq.m @ 1/' + result.ratePerSqm, cars: result.cars })
  } else if (result.typology === 'mercantile' || result.typology === 'office') {
    if (result.nil === true) {
      rows.push({ label: 'NIL exemption', detail: result.area + ' sq.m ≤ 50 sq.m', cars: 0 })
    } else {
      for (i = 0; i < result.slabs.length; i = i + 1) {
        rows.push({ label: result.slabs[i].label, detail: result.slabs[i].area + ' sq.m', cars: result.slabs[i].cars })
      }
    }
  } else if (result.typology === 'school') {
    rows.push({ label: 'Admin', detail: result.admin.area + ' sq.m', cars: result.admin.cars })
    if (result.assembly.type !== 'none') {
      rows.push({ label: 'Assembly', detail: String(result.assembly.value), cars: result.assembly.cars })
    }
    if (result.canteen.area > 0) {
      if (result.canteen.nil === true) {
        rows.push({ label: 'Canteen', detail: result.canteen.area + ' sq.m ≤ 50 sq.m', cars: 0 })
      } else {
        rows.push({ label: 'Canteen', detail: result.canteen.area + ' sq.m', cars: result.canteen.subTotal })
      }
    }
  }

  return rows
}

function getStatColStyle(index) {
  return {
    flex: 1,
    textAlign: 'center',
    padding: '0 8px',
    borderLeft: index > 0 ? '1px solid #2D5A3D' : 'none'
  }
}

function Parking() {
  var typologyState = React.useState('residential')
  var typology = typologyState[0]
  var setTypology = typologyState[1]

  var devTypeState = React.useState('new')
  var devType = devTypeState[0]
  var setDevType = devTypeState[1]

  var upto45State = React.useState('')
  var upto45 = upto45State[0]
  var setUpto45 = upto45State[1]

  var to60State = React.useState('')
  var to60 = to60State[0]
  var setTo60 = to60State[1]

  var to90State = React.useState('')
  var to90 = to90State[0]
  var setTo90 = to90State[1]

  var above90State = React.useState('')
  var above90 = above90State[0]
  var setAbove90 = above90State[1]

  var shopAreaState = React.useState('')
  var shopArea = shopAreaState[0]
  var setShopArea = shopAreaState[1]

  var shopSizeCategoryState = React.useState('above_20sqm')
  var shopSizeCategory = shopSizeCategoryState[0]
  var setShopSizeCategory = shopSizeCategoryState[1]

  var mercantileAreaState = React.useState('')
  var mercantileArea = mercantileAreaState[0]
  var setMercantileArea = mercantileAreaState[1]

  var officeAreaState = React.useState('')
  var officeArea = officeAreaState[0]
  var setOfficeArea = officeAreaState[1]

  var adminAreaState = React.useState('')
  var adminArea = adminAreaState[0]
  var setAdminArea = adminAreaState[1]

  var assemblyPresentState = React.useState('no')
  var assemblyPresent = assemblyPresentState[0]
  var setAssemblyPresent = assemblyPresentState[1]

  var assemblySeatTypeState = React.useState('fixed')
  var assemblySeatType = assemblySeatTypeState[0]
  var setAssemblySeatType = assemblySeatTypeState[1]

  var assemblySeatsState = React.useState('')
  var assemblySeats = assemblySeatsState[0]
  var setAssemblySeats = assemblySeatsState[1]

  var assemblyFloorAreaState = React.useState('')
  var assemblyFloorArea = assemblyFloorAreaState[0]
  var setAssemblyFloorArea = assemblyFloorAreaState[1]

  var canteenPresentState = React.useState('no')
  var canteenPresent = canteenPresentState[0]
  var setCanteenPresent = canteenPresentState[1]

  var canteenAreaState = React.useState('')
  var canteenArea = canteenAreaState[0]
  var setCanteenArea = canteenAreaState[1]

  var resultState = React.useState(null)
  var result = resultState[0]
  var setResult = resultState[1]

  function handleTypologyChange(e) {
    setTypology(e.target.value)
    setResult(null)
  }

  function handleCalculate() {
    var inputs = null

    if (typology === 'residential') {
      inputs = {
        slabCounts: {
          upto45: Number(upto45),
          to60: Number(to60),
          to90: Number(to90),
          above90: Number(above90)
        },
        devType: devType
      }
    } else if (typology === 'shopping_convenience') {
      inputs = {
        totalArea: Number(shopArea),
        shopSizeCategory: shopSizeCategory
      }
    } else if (typology === 'mercantile') {
      inputs = {
        area: Number(mercantileArea)
      }
    } else if (typology === 'office') {
      inputs = {
        area: Number(officeArea)
      }
    } else if (typology === 'school') {
      var resolvedAssemblyType = 'none'
      var resolvedAssemblyValue = 0
      if (assemblyPresent === 'yes') {
        resolvedAssemblyType = assemblySeatType
        resolvedAssemblyValue = assemblySeatType === 'fixed' ? Number(assemblySeats) : Number(assemblyFloorArea)
      }
      inputs = {
        adminArea: Number(adminArea),
        assemblyType: resolvedAssemblyType,
        assemblyValue: resolvedAssemblyValue,
        canteenArea: canteenPresent === 'yes' ? Number(canteenArea) : 0
      }
    }

    var calcResult = calcParking(typology, inputs)
    setResult(calcResult)
  }

  var headingStyle = {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1E2820',
    fontFamily: 'system-ui',
    marginBottom: '4px'
  }

  var subheadingStyle = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#787774',
    fontFamily: 'system-ui',
    marginBottom: '24px'
  }

  var panelRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    alignItems: 'flex-start'
  }

  var inputsPanelStyle = {
    backgroundColor: '#FFFFFF',
    border: '0.5px solid #E2DDD5',
    borderRadius: '8px',
    padding: '20px 24px',
    flex: 1,
    fontFamily: 'system-ui'
  }

  var resultsPanelStyle = {
    backgroundColor: '#1E2820',
    borderRadius: '8px',
    padding: '20px 24px',
    minWidth: '280px',
    flex: 1,
    fontFamily: 'system-ui'
  }

  var sectionLabelStyle = {
    fontSize: '10px',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#787774',
    marginBottom: '4px'
  }

  var fieldGroupStyle = {
    marginTop: '12px'
  }

  var inputStyle = {
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '5px',
    padding: '6px 10px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui',
    width: '100%',
    boxSizing: 'border-box'
  }

  var selectStyle = {
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '5px',
    padding: '6px 10px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui',
    width: '100%',
    boxSizing: 'border-box'
  }

  var basisLineStyle = {
    backgroundColor: '#F5F0E8',
    border: '0.5px solid #E2DDD5',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#787774',
    fontFamily: 'system-ui',
    marginTop: '20px'
  }

  var basisPrefixStyle = {
    fontSize: '10px',
    fontStyle: 'normal',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: '#787774',
    marginRight: '8px'
  }

  var buttonStyle = {
    backgroundColor: '#CC6644',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    width: '100%',
    marginTop: '16px',
    cursor: 'pointer',
    fontFamily: 'system-ui'
  }

  var regTagStyle = {
    backgroundColor: '#4A7C5F',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 500,
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '16px'
  }

  var resultNumberStyle = {
    fontSize: '48px',
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1
  }

  var resultUnitStyle = {
    fontSize: '14px',
    fontWeight: 400,
    color: '#9BB5BF',
    marginBottom: '20px'
  }

  var statsRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #2D5A3D',
    borderBottom: '1px solid #2D5A3D',
    padding: '12px 0',
    marginBottom: '16px'
  }

  var statNumberStyle = {
    fontSize: '18px',
    fontWeight: 500,
    color: '#FFFFFF'
  }

  var statLabelStyle = {
    fontSize: '10px',
    fontWeight: 400,
    color: '#9BB5BF',
    marginTop: '2px'
  }

  var breakdownRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9BB5BF',
    padding: '6px 0',
    borderBottom: '1px solid #2D5A3D'
  }

  var breakdownLabelStyle = {
    color: '#F5F0E8',
    flex: 1
  }

  var breakdownDetailStyle = {
    color: '#9BB5BF',
    flex: 1,
    textAlign: 'center'
  }

  var breakdownCarsStyle = {
    color: '#FFFFFF',
    fontWeight: 500,
    flex: 0,
    minWidth: '40px',
    textAlign: 'right'
  }

  var emptyStateStyle = {
    fontSize: '13px',
    color: '#9BB5BF',
    fontStyle: 'italic'
  }

  return (
    <div>
      <div style={headingStyle}>Parking</div>
      <div style={subheadingStyle}>Reg 44(2)(3)(4)(5), Table 21, DCPR 2034</div>

      <div style={panelRowStyle}>
        <div style={inputsPanelStyle}>
          <div style={sectionLabelStyle}>Typology</div>
          <select style={selectStyle} value={typology} onChange={handleTypologyChange}>
            <option value="residential">Residential</option>
            <option value="shopping_convenience">Shopping / Convenience</option>
            <option value="mercantile">Mercantile</option>
            <option value="office">Office / Commercial</option>
            <option value="school">School / Educational</option>
          </select>

          {typology === 'residential' ? (
            <div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Development Type</div>
                <select style={selectStyle} value={devType} onChange={function (e) { setDevType(e.target.value) }}>
                  <option value="new">New Development</option>
                  <option value="redevelopment_33series">Redevelopment (33-series)</option>
                </select>
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Tenements &mdash; up to 45 sq.m</div>
                <input style={inputStyle} type="number" value={upto45} onChange={function (e) { setUpto45(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Tenements &mdash; 45 to 60 sq.m</div>
                <input style={inputStyle} type="number" value={to60} onChange={function (e) { setTo60(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Tenements &mdash; 60 to 90 sq.m</div>
                <input style={inputStyle} type="number" value={to90} onChange={function (e) { setTo90(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Tenements &mdash; above 90 sq.m</div>
                <input style={inputStyle} type="number" value={above90} onChange={function (e) { setAbove90(e.target.value) }} />
              </div>
            </div>
          ) : null}

          {typology === 'shopping_convenience' ? (
            <div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Total Shopping Built-up Area (sq.m)</div>
                <input style={inputStyle} type="number" value={shopArea} onChange={function (e) { setShopArea(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Predominant Shop Size</div>
                <select style={selectStyle} value={shopSizeCategory} onChange={function (e) { setShopSizeCategory(e.target.value) }}>
                  <option value="upto_20sqm">Up to 20 sq.m</option>
                  <option value="above_20sqm">Above 20 sq.m</option>
                </select>
              </div>
            </div>
          ) : null}

          {typology === 'mercantile' ? (
            <div style={fieldGroupStyle}>
              <div style={sectionLabelStyle}>Total Built-up Area (sq.m)</div>
              <input style={inputStyle} type="number" value={mercantileArea} onChange={function (e) { setMercantileArea(e.target.value) }} />
            </div>
          ) : null}

          {typology === 'office' ? (
            <div style={fieldGroupStyle}>
              <div style={sectionLabelStyle}>Total Office Built-up Area (sq.m)</div>
              <input style={inputStyle} type="number" value={officeArea} onChange={function (e) { setOfficeArea(e.target.value) }} />
            </div>
          ) : null}

          {typology === 'school' ? (
            <div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Admin / Public Service Area (sq.m)</div>
                <input style={inputStyle} type="number" value={adminArea} onChange={function (e) { setAdminArea(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Assembly Hall / Auditorium Present?</div>
                <select style={selectStyle} value={assemblyPresent} onChange={function (e) { setAssemblyPresent(e.target.value) }}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {assemblyPresent === 'yes' ? (
                <div>
                  <div style={fieldGroupStyle}>
                    <div style={sectionLabelStyle}>Seating Type</div>
                    <select style={selectStyle} value={assemblySeatType} onChange={function (e) { setAssemblySeatType(e.target.value) }}>
                      <option value="fixed">Fixed Seats</option>
                      <option value="no_fixed">No Fixed Seats</option>
                    </select>
                  </div>
                  {assemblySeatType === 'fixed' ? (
                    <div style={fieldGroupStyle}>
                      <div style={sectionLabelStyle}>Number of Seats</div>
                      <input style={inputStyle} type="number" value={assemblySeats} onChange={function (e) { setAssemblySeats(e.target.value) }} />
                    </div>
                  ) : (
                    <div style={fieldGroupStyle}>
                      <div style={sectionLabelStyle}>Assembly Floor Area (sq.m)</div>
                      <input style={inputStyle} type="number" value={assemblyFloorArea} onChange={function (e) { setAssemblyFloorArea(e.target.value) }} />
                    </div>
                  )}
                </div>
              ) : null}

              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Canteen / Tiffin Room Present?</div>
                <select style={selectStyle} value={canteenPresent} onChange={function (e) { setCanteenPresent(e.target.value) }}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {canteenPresent === 'yes' ? (
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Canteen / Tiffin Room Area (sq.m)</div>
                  <input style={inputStyle} type="number" value={canteenArea} onChange={function (e) { setCanteenArea(e.target.value) }} />
                </div>
              ) : null}
            </div>
          ) : null}

          <div style={basisLineStyle}>
            <span style={basisPrefixStyle}>BASIS</span>
            DCPR 2034, Reg 44(2), Table 21
          </div>

          <button type="button" style={buttonStyle} onClick={handleCalculate}>Calculate</button>
        </div>

        <div style={resultsPanelStyle}>
          {result ? (
            <div>
              <div style={regTagStyle}>{result.regulation}</div>
              <div style={resultNumberStyle}>{getMainTotal(result)}</div>
              <div style={resultUnitStyle}>cars</div>

              <div style={statsRowStyle}>
                {getStats(result).map(function (stat, index) {
                  return (
                    <div key={stat.label} style={getStatColStyle(index)}>
                      <div style={statNumberStyle}>{stat.value}</div>
                      <div style={statLabelStyle}>{stat.label}</div>
                    </div>
                  )
                })}
              </div>

              <div>
                {getBreakdownRows(result).map(function (row, index) {
                  return (
                    <div key={index} style={breakdownRowStyle}>
                      <span style={breakdownLabelStyle}>{row.label}</span>
                      <span style={breakdownDetailStyle}>{row.detail}</span>
                      <span style={breakdownCarsStyle}>{row.cars}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={emptyStateStyle}>Enter inputs and calculate to see results</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Parking
