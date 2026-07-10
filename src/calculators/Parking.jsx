import React from 'react'
import { calcMixedUse } from '../utils/parkingCalc.js'

var RESIDENTIAL_SLAB_LABELS = ['Up to 45 sq.m', '45 to 60 sq.m', '60 to 90 sq.m', 'Above 90 sq.m']

function typologyDisplayName(typology) {
  if (typology === 'residential') return 'Residential (Table 21, Sr. 1(i))'
  if (typology === 'shopping_convenience') return 'Shopping / Convenience (Table 21, Sr. 10)'
  if (typology === 'mercantile') return 'Mercantile (Table 21, Sr. 5)'
  if (typology === 'office') return 'Office / Commercial (Table 21, Sr. 4)'
  if (typology === 'school') return 'School / Educational (Table 21, Sr. 2/3)'
  return typology
}

// Normalizes each typology's result shape into a uniform
// { name, slabs: [{label, area, rate, cars}], subTotal, visitor, total }
// for the Section 10 COMPONENT / AREA / RATE / CARS breakdown table.
function normalizeComponent(result) {
  var name = typologyDisplayName(result.typology)
  var i

  if (result.typology === 'residential') {
    var slabs = []
    for (i = 0; i < result.slabs.length; i = i + 1) {
      slabs.push({
        label: RESIDENTIAL_SLAB_LABELS[i],
        area: result.slabs[i].count + ' tenements',
        rate: '1 / ' + result.slabs[i].perN,
        cars: result.slabs[i].cars
      })
    }
    return { name: name, slabs: slabs, subTotal: result.subTotal, visitor: result.visitor, total: result.total }
  }

  if (result.typology === 'shopping_convenience') {
    var shopSlabs = []
    for (i = 0; i < result.slabs.length; i = i + 1) {
      var slabLabel = result.slabs[i].label === 'upto_20sqm' ? 'Shops ≤ 20 sq.m' : 'Shops > 20 sq.m'
      shopSlabs.push({
        label: slabLabel,
        area: result.slabs[i].area + ' sq.m',
        rate: '1 / ' + result.slabs[i].rate + ' sq.m',
        cars: result.slabs[i].cars
      })
    }
    return { name: name, slabs: shopSlabs, subTotal: result.cars, visitor: result.visitor, total: result.total }
  }

  if (result.typology === 'mercantile' || result.typology === 'office') {
    if (result.nil === true) {
      return {
        name: name,
        slabs: [{ label: 'NIL exemption', area: result.area + ' sq.m', rate: '≤ 50 sq.m', cars: 0 }],
        subTotal: 0,
        visitor: 0,
        total: 0
      }
    }
    var boundaryLabels = result.typology === 'mercantile' ? ['Up to 800 sq.m', 'Above 800 sq.m'] : ['Up to 1500 sq.m', 'Above 1500 sq.m']
    var slabs2 = []
    for (i = 0; i < result.slabs.length; i = i + 1) {
      if (result.slabs[i].area > 0) {
        slabs2.push({
          label: boundaryLabels[i],
          area: result.slabs[i].area + ' sq.m',
          rate: '1 / ' + result.slabs[i].rate + ' sq.m',
          cars: result.slabs[i].cars
        })
      }
    }
    return { name: name, slabs: slabs2, subTotal: result.subTotal, visitor: result.visitor, total: result.total }
  }

  if (result.typology === 'school') {
    var schoolSlabs = []
    schoolSlabs.push({
      label: 'Admin / Public Service',
      area: result.admin.area + ' sq.m',
      rate: '1 / 35 sq.m',
      cars: result.admin.cars
    })
    if (result.assembly.type !== 'none') {
      var assemblyUnit = result.assembly.type === 'fixed' ? ' seats' : ' sq.m'
      var assemblyRate = result.assembly.type === 'fixed' ? '1 / 12 seats' : '1 / 15 sq.m'
      schoolSlabs.push({
        label: 'Assembly Hall',
        area: result.assembly.value + assemblyUnit,
        rate: assemblyRate,
        cars: result.assembly.cars
      })
    }
    if (result.canteen.area > 0) {
      if (result.canteen.nil === true) {
        schoolSlabs.push({ label: 'Canteen / Tiffin Room', area: result.canteen.area + ' sq.m', rate: 'NIL ≤ 50 sq.m', cars: 0 })
      } else {
        schoolSlabs.push({ label: 'Canteen / Tiffin Room', area: result.canteen.area + ' sq.m', rate: '1/40, 1/80', cars: result.canteen.subTotal })
      }
    }
    var schoolSubTotal = result.admin.cars + result.assembly.cars + result.canteen.subTotal
    var schoolVisitor = result.admin.visitor + result.assembly.visitor + result.canteen.visitor
    return { name: name, slabs: schoolSlabs, subTotal: schoolSubTotal, visitor: schoolVisitor, total: result.grandTotal }
  }

  return { name: name, slabs: [], subTotal: 0, visitor: 0, total: 0 }
}

function Parking() {
  var residentialCheckedState = React.useState(false)
  var residentialChecked = residentialCheckedState[0]
  var setResidentialChecked = residentialCheckedState[1]

  var shoppingCheckedState = React.useState(false)
  var shoppingChecked = shoppingCheckedState[0]
  var setShoppingChecked = shoppingCheckedState[1]

  var mercantileCheckedState = React.useState(false)
  var mercantileChecked = mercantileCheckedState[0]
  var setMercantileChecked = mercantileCheckedState[1]

  var officeCheckedState = React.useState(false)
  var officeChecked = officeCheckedState[0]
  var setOfficeChecked = officeCheckedState[1]

  var schoolCheckedState = React.useState(false)
  var schoolChecked = schoolCheckedState[0]
  var setSchoolChecked = schoolCheckedState[1]

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

  var shopAreaUpto20State = React.useState('')
  var shopAreaUpto20 = shopAreaUpto20State[0]
  var setShopAreaUpto20 = shopAreaUpto20State[1]

  var shopAreaAbove20State = React.useState('')
  var shopAreaAbove20 = shopAreaAbove20State[0]
  var setShopAreaAbove20 = shopAreaAbove20State[1]

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

  function handleCalculate() {
    var components = []

    if (residentialChecked) {
      components.push({
        typology: 'residential',
        inputs: {
          slabCounts: {
            upto45: Number(upto45),
            to60: Number(to60),
            to90: Number(to90),
            above90: Number(above90)
          },
          devType: devType
        }
      })
    }

    if (shoppingChecked) {
      components.push({
        typology: 'shopping_convenience',
        inputs: {
          areaUpto20: Number(shopAreaUpto20),
          areaAbove20: Number(shopAreaAbove20)
        }
      })
    }

    if (mercantileChecked) {
      components.push({
        typology: 'mercantile',
        inputs: { area: Number(mercantileArea) }
      })
    }

    if (officeChecked) {
      components.push({
        typology: 'office',
        inputs: { area: Number(officeArea) }
      })
    }

    if (schoolChecked) {
      var resolvedAssemblyType = 'none'
      var resolvedAssemblyValue = 0
      if (assemblyPresent === 'yes') {
        resolvedAssemblyType = assemblySeatType
        resolvedAssemblyValue = assemblySeatType === 'fixed' ? Number(assemblySeats) : Number(assemblyFloorArea)
      }
      components.push({
        typology: 'school',
        inputs: {
          adminArea: Number(adminArea),
          assemblyType: resolvedAssemblyType,
          assemblyValue: resolvedAssemblyValue,
          canteenArea: canteenPresent === 'yes' ? Number(canteenArea) : 0
        }
      })
    }

    if (components.length === 0) {
      setResult(null)
      return
    }

    var mixedResult = calcMixedUse(components)
    setResult(mixedResult)
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
    minWidth: '320px',
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

  var checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#1E2820',
    fontFamily: 'system-ui'
  }

  var typologyBlockStyle = {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '0.5px solid #E2DDD5'
  }

  var typologyTitleStyle = {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1E2820',
    marginBottom: '4px'
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

  var colHeaderRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '10px',
    color: '#9BB5BF',
    textTransform: 'uppercase',
    borderBottom: '1px solid #2D5A3D',
    paddingBottom: '6px',
    marginBottom: '4px'
  }

  var colComponentStyle = {
    flex: 2
  }

  var colAreaStyle = {
    flex: 1,
    textAlign: 'right'
  }

  var colRateStyle = {
    flex: 1,
    textAlign: 'right'
  }

  var colCarsStyle = {
    flex: 1,
    textAlign: 'right'
  }

  var componentBlockStyle = {
    marginBottom: '12px'
  }

  var componentNameRowStyle = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#F5F0E8',
    padding: '8px 0 4px 0'
  }

  var slabRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '12px',
    color: '#9BB5BF',
    padding: '4px 0',
    paddingLeft: '12px'
  }

  var subRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '12px',
    color: '#9BB5BF',
    padding: '4px 0',
    paddingLeft: '12px'
  }

  var componentTotalRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '13px',
    color: '#FFFFFF',
    padding: '6px 0',
    paddingLeft: '12px',
    borderTop: '1px solid #2D5A3D',
    marginTop: '2px'
  }

  var footerDividerStyle = {
    borderTop: '1px solid #2D5A3D',
    margin: '12px 0'
  }

  var footerRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '13px',
    color: '#FFFFFF',
    padding: '6px 0'
  }

  var regulationLineStyle = {
    fontSize: '11px',
    color: '#9BB5BF',
    marginTop: '4px'
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
          <div style={sectionLabelStyle}>Typologies (select one or more)</div>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={residentialChecked} onChange={function (e) { setResidentialChecked(e.target.checked) }} />
            Residential
          </label>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={shoppingChecked} onChange={function (e) { setShoppingChecked(e.target.checked) }} />
            Shopping / Convenience
          </label>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={mercantileChecked} onChange={function (e) { setMercantileChecked(e.target.checked) }} />
            Mercantile
          </label>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={officeChecked} onChange={function (e) { setOfficeChecked(e.target.checked) }} />
            Office / Commercial
          </label>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" checked={schoolChecked} onChange={function (e) { setSchoolChecked(e.target.checked) }} />
            School / Educational
          </label>

          {residentialChecked ? (
            <div style={typologyBlockStyle}>
              <div style={typologyTitleStyle}>Residential</div>
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

          {shoppingChecked ? (
            <div style={typologyBlockStyle}>
              <div style={typologyTitleStyle}>Shopping / Convenience</div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Area of Shops &le; 20 sq.m (optional)</div>
                <input style={inputStyle} type="number" value={shopAreaUpto20} onChange={function (e) { setShopAreaUpto20(e.target.value) }} />
              </div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Area of Shops &gt; 20 sq.m (optional)</div>
                <input style={inputStyle} type="number" value={shopAreaAbove20} onChange={function (e) { setShopAreaAbove20(e.target.value) }} />
              </div>
            </div>
          ) : null}

          {mercantileChecked ? (
            <div style={typologyBlockStyle}>
              <div style={typologyTitleStyle}>Mercantile</div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Total Built-up Area (sq.m)</div>
                <input style={inputStyle} type="number" value={mercantileArea} onChange={function (e) { setMercantileArea(e.target.value) }} />
              </div>
            </div>
          ) : null}

          {officeChecked ? (
            <div style={typologyBlockStyle}>
              <div style={typologyTitleStyle}>Office / Commercial</div>
              <div style={fieldGroupStyle}>
                <div style={sectionLabelStyle}>Total Office Built-up Area (sq.m)</div>
                <input style={inputStyle} type="number" value={officeArea} onChange={function (e) { setOfficeArea(e.target.value) }} />
              </div>
            </div>
          ) : null}

          {schoolChecked ? (
            <div style={typologyBlockStyle}>
              <div style={typologyTitleStyle}>School / Educational</div>
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
              <div style={regTagStyle}>Table 21</div>
              <div style={resultNumberStyle}>{result.grandTotal}</div>
              <div style={resultUnitStyle}>total cars</div>

              <div style={colHeaderRowStyle}>
                <div style={colComponentStyle}>Component</div>
                <div style={colAreaStyle}>Area</div>
                <div style={colRateStyle}>Rate</div>
                <div style={colCarsStyle}>Cars</div>
              </div>

              {result.components.map(function (comp, idx) {
                var norm = normalizeComponent(comp)
                return (
                  <div key={idx} style={componentBlockStyle}>
                    <div style={componentNameRowStyle}>{norm.name}</div>
                    {norm.slabs.map(function (slab, sIdx) {
                      return (
                        <div key={sIdx} style={slabRowStyle}>
                          <div style={colComponentStyle}>{slab.label}</div>
                          <div style={colAreaStyle}>{slab.area}</div>
                          <div style={colRateStyle}>{slab.rate}</div>
                          <div style={colCarsStyle}>{slab.cars}</div>
                        </div>
                      )
                    })}
                    <div style={subRowStyle}>
                      <div style={colComponentStyle}>Sub-total</div>
                      <div style={colAreaStyle}></div>
                      <div style={colRateStyle}></div>
                      <div style={colCarsStyle}>{norm.subTotal}</div>
                    </div>
                    <div style={subRowStyle}>
                      <div style={colComponentStyle}>Visitor (10%)</div>
                      <div style={colAreaStyle}></div>
                      <div style={colRateStyle}></div>
                      <div style={colCarsStyle}>{norm.visitor}</div>
                    </div>
                    <div style={componentTotalRowStyle}>
                      <div style={colComponentStyle}><strong>Component Total</strong></div>
                      <div style={colAreaStyle}></div>
                      <div style={colRateStyle}></div>
                      <div style={colCarsStyle}><strong>{norm.total}</strong></div>
                    </div>
                  </div>
                )
              })}

              <div style={footerDividerStyle}></div>

              <div style={footerRowStyle}>
                <div style={colComponentStyle}><strong>TOTAL CAR PARKING REQUIRED</strong></div>
                <div style={colAreaStyle}></div>
                <div style={colRateStyle}></div>
                <div style={colCarsStyle}><strong>{result.grandTotal}</strong></div>
              </div>
              <div style={footerRowStyle}>
                <div style={colComponentStyle}>TWO-WHEELER PARKING (optional &mdash; if proposed)</div>
                <div style={colAreaStyle}></div>
                <div style={colRateStyle}></div>
                <div style={colCarsStyle}>{result.twoWheelerOptional}</div>
              </div>
              <div style={footerRowStyle}>
                <div style={colComponentStyle}>TRANSPORT VEHICLES</div>
                <div style={colAreaStyle}></div>
                <div style={colRateStyle}></div>
                <div style={colCarsStyle}>{result.transportVehicle}</div>
              </div>

              <div style={footerDividerStyle}></div>
              <div style={regulationLineStyle}>REGULATION: Reg 44(2)(3)(4)(5), Table 21, DCPR 2034</div>
            </div>
          ) : (
            <div style={emptyStateStyle}>Select at least one typology, enter inputs and calculate to see results</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Parking
