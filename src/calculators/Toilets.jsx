import React from 'react'
import { calcToilets } from '../utils/toiletCalc.js'

function buildFixtureRows(maleObj, femaleObj) {
  return [
    { label: 'WCs', male: maleObj.wc, female: femaleObj.wc, total: maleObj.wc + femaleObj.wc },
    { label: 'Urinals', male: maleObj.urinal, female: null, total: maleObj.urinal },
    { label: 'Wash basins', male: maleObj.washbasin, female: femaleObj.washbasin, total: maleObj.washbasin + femaleObj.washbasin },
    { label: 'Drinking water', male: maleObj.drinkingWater, female: femaleObj.drinkingWater, total: maleObj.drinkingWater + femaleObj.drinkingWater }
  ]
}

function Toilets() {
  var projectNameState = React.useState('')
  var projectName = projectNameState[0]
  var setProjectName = projectNameState[1]

  var typologyState = React.useState('school')
  var typology = typologyState[0]
  var setTypology = typologyState[1]

  var schoolAreaState = React.useState('')
  var schoolArea = schoolAreaState[0]
  var setSchoolArea = schoolAreaState[1]

  var boysPercentState = React.useState('50')
  var boysPercent = boysPercentState[0]
  var setBoysPercent = boysPercentState[1]

  var staffPercentState = React.useState('')
  var staffPercent = staffPercentState[0]
  var setStaffPercent = staffPercentState[1]

  var staffMalePercentState = React.useState('50')
  var staffMalePercent = staffMalePercentState[0]
  var setStaffMalePercent = staffMalePercentState[1]

  var officeAreaState = React.useState('')
  var officeArea = officeAreaState[0]
  var setOfficeArea = officeAreaState[1]

  var officeMalePercentState = React.useState('50')
  var officeMalePercent = officeMalePercentState[0]
  var setOfficeMalePercent = officeMalePercentState[1]

  var floorsState = React.useState([{ level: 'street', area: '' }])
  var floors = floorsState[0]
  var setFloors = floorsState[1]

  var retailMalePercentState = React.useState('50')
  var retailMalePercent = retailMalePercentState[0]
  var setRetailMalePercent = retailMalePercentState[1]

  var resultState = React.useState(null)
  var result = resultState[0]
  var setResult = resultState[1]

  var calculationDateState = React.useState('')
  var calculationDate = calculationDateState[0]
  var setCalculationDate = calculationDateState[1]

  function handleTypologyChange(e) {
    setTypology(e.target.value)
    setResult(null)
  }

  function handleFloorLevelChange(index, value) {
    var newFloors = floors.slice()
    newFloors[index] = { level: value, area: floors[index].area }
    setFloors(newFloors)
  }

  function handleFloorAreaChange(index, value) {
    var newFloors = floors.slice()
    newFloors[index] = { level: floors[index].level, area: value }
    setFloors(newFloors)
  }

  function handleAddFloor() {
    var newFloors = floors.slice()
    newFloors.push({ level: 'upper', area: '' })
    setFloors(newFloors)
  }

  function handleRemoveFloor(index) {
    if (floors.length <= 1) {
      return
    }
    var newFloors = floors.slice(0, index).concat(floors.slice(index + 1))
    setFloors(newFloors)
  }

  function handleCalculate() {
    var inputs = null

    if (typology === 'school') {
      inputs = {
        area: Number(schoolArea),
        boysPercent: Number(boysPercent),
        girlsPercent: 100 - Number(boysPercent),
        staffPercent: staffPercent === '' ? 0 : Number(staffPercent),
        staffMalePercent: Number(staffMalePercent),
        staffFemalePercent: 100 - Number(staffMalePercent)
      }
    } else if (typology === 'office') {
      inputs = {
        area: Number(officeArea),
        malePercent: Number(officeMalePercent)
      }
    } else if (typology === 'retail') {
      var i
      var parsedFloors = []
      for (i = 0; i < floors.length; i = i + 1) {
        parsedFloors.push({ level: floors[i].level, area: Number(floors[i].area) })
      }
      inputs = {
        floors: parsedFloors,
        malePercent: Number(retailMalePercent)
      }
    }

    var calcResult = calcToilets(typology, inputs)
    setResult(calcResult)
    setCalculationDate(new Date().toLocaleDateString())
  }

  function handleDownloadPdf() {
    window.print()
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

  var pdfButtonStyle = {
    backgroundColor: '#1E2820',
    color: '#F5F0E8',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '6px',
    border: '0.5px solid #E2DDD5',
    width: '100%',
    marginTop: '12px',
    cursor: 'pointer',
    fontFamily: 'system-ui'
  }

  var secondaryButtonStyle = {
    backgroundColor: '#1E2820',
    color: '#F5F0E8',
    fontSize: '13px',
    fontWeight: 400,
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'system-ui',
    marginTop: '8px'
  }

  var floorRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    marginTop: '8px'
  }

  var removeFloorStyle = {
    fontSize: '12px',
    color: '#C0392B',
    cursor: 'pointer',
    fontFamily: 'system-ui',
    whiteSpace: 'nowrap'
  }

  var projectNameLineStyle = {
    fontSize: '15px',
    fontWeight: 500,
    color: '#F5F0E8',
    marginBottom: '4px'
  }

  var calculationDateLineStyle = {
    fontSize: '11px',
    color: '#9BB5BF',
    marginBottom: '16px'
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
    marginBottom: '6px'
  }

  var nbcRefStyle = {
    fontSize: '11px',
    color: '#9BB5BF',
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
    marginBottom: '16px'
  }

  var statLineStyle = {
    fontSize: '12px',
    color: '#9BB5BF',
    marginBottom: '20px'
  }

  var tableSectionTitleStyle = {
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#4A7C5F',
    marginTop: '20px',
    marginBottom: '8px'
  }

  var tableHeaderRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '10px',
    color: '#9BB5BF',
    textTransform: 'uppercase',
    borderBottom: '1px solid #2D5A3D',
    paddingBottom: '6px'
  }

  var tableRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '13px',
    color: '#F5F0E8',
    padding: '6px 0',
    borderBottom: '1px solid #2D5A3D'
  }

  var tableLabelCellStyle = {
    flex: 2
  }

  var tableValueCellStyle = {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF'
  }

  var cleanerSinkStyle = {
    fontSize: '12px',
    color: '#9BB5BF',
    marginTop: '10px'
  }

  var daNoteStyle = {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #2D5A3D',
    pageBreakInside: 'avoid',
    breakInside: 'avoid'
  }

  var daNoteHeadingStyle = {
    fontSize: '10px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#4A7C5F',
    marginBottom: '6px'
  }

  var daNoteBodyStyle = {
    fontSize: '11px',
    color: '#9BB5BF',
    lineHeight: 1.6
  }

  var footerDividerStyle = {
    borderTop: '1px solid #2D5A3D',
    margin: '16px 0 12px 0'
  }

  var regulationLineStyle = {
    fontSize: '11px',
    color: '#9BB5BF',
    marginBottom: '4px'
  }

  var emptyStateStyle = {
    fontSize: '13px',
    color: '#9BB5BF',
    fontStyle: 'italic'
  }

  function renderFixtureTable(title, maleObj, femaleObj) {
    var rows = buildFixtureRows(maleObj, femaleObj)
    return (
      <div>
        <div style={tableSectionTitleStyle}>{title}</div>
        <div style={tableHeaderRowStyle}>
          <div style={tableLabelCellStyle}>Fixture</div>
          <div style={tableValueCellStyle}>Male</div>
          <div style={tableValueCellStyle}>Female</div>
          <div style={tableValueCellStyle}>Total</div>
        </div>
        {rows.map(function (row) {
          return (
            <div key={row.label} style={tableRowStyle}>
              <div style={tableLabelCellStyle}>{row.label}</div>
              <div style={tableValueCellStyle}>{row.male}</div>
              <div style={tableValueCellStyle}>{row.female === null ? '—' : row.female}</div>
              <div style={tableValueCellStyle}>{row.total}</div>
            </div>
          )
        })}
      </div>
    )
  }

  function renderFixtureBasis(fixtureBasis) {
    if (!fixtureBasis || fixtureBasis.length === 0) {
      return null
    }
    return (
      <div>
        <div style={tableSectionTitleStyle}>WC &amp; Wash Basin Working</div>
        {fixtureBasis.map(function (entry, index) {
          return (
            <div key={index} style={tableRowStyle}>
              <div style={tableLabelCellStyle}>{entry.group} — {entry.fixture}: {entry.formula}</div>
              <div style={tableValueCellStyle}></div>
              <div style={tableValueCellStyle}></div>
              <div style={tableValueCellStyle}>{entry.value}</div>
            </div>
          )
        })}
      </div>
    )
  }

  function renderUrinalWorking(urinalWorking) {
    if (!urinalWorking) {
      return null
    }
    return (
      <div>
        <div style={tableSectionTitleStyle}>Urinal Slab Working (Male)</div>
        {urinalWorking.steps.map(function (step, index) {
          return (
            <div key={index} style={tableRowStyle}>
              <div style={tableLabelCellStyle}>{step.range}</div>
              <div style={tableValueCellStyle}></div>
              <div style={tableValueCellStyle}></div>
              <div style={tableValueCellStyle}>{step.value}</div>
            </div>
          )
        })}
        <div style={tableRowStyle}>
          <div style={tableLabelCellStyle}><strong>Total urinals</strong></div>
          <div style={tableValueCellStyle}></div>
          <div style={tableValueCellStyle}></div>
          <div style={tableValueCellStyle}><strong>{urinalWorking.total}</strong></div>
        </div>
      </div>
    )
  }

  function renderDAToiletNote(daToilet) {
    return (
      <div style={daNoteStyle}>
        <div style={daNoteHeadingStyle}>DA Toilet — {daToilet.regulation}</div>
        <div style={daNoteBodyStyle}>
          1 special WC per toilet set<br />
          Min size: {daToilet.min_size}<br />
          Door: {daToilet.door_clear}<br />
          Wash basin: {daToilet.wash_basin_height}<br />
          Handrails: vertical and horizontal, 50mm clearance from wall<br />
          Emergency call bell: mandatory
        </div>
      </div>
    )
  }

  function renderResult() {
    if (!result) {
      return <div style={emptyStateStyle}>Enter inputs and calculate to see results</div>
    }

    if (result.typology === 'school') {
      return (
        <div>
          <div style={regTagStyle}>DCPR Table 13, Sr. 2</div>
          <div style={nbcRefStyle}>NBC 2016 Part 9, Table 15</div>
          <div style={resultNumberStyle}>{result.totals.total.wc}</div>
          <div style={resultUnitStyle}>total WCs</div>
          <div style={statLineStyle}>
            Area: {result.area} sq.m &nbsp;|&nbsp; Occupants: {result.totalOccupants} &nbsp;|&nbsp; Boys: {result.boys} &nbsp;|&nbsp; Girls: {result.girls}
            {result.staffEntered ? <span>&nbsp;|&nbsp; Staff: {result.staffCount} ({result.staffMale}M / {result.staffFemale}F)</span> : null}
          </div>

          {renderFixtureTable('Student Fixtures', result.studentFixtures.boys, result.studentFixtures.girls)}
          {result.staffEntered ? renderFixtureTable('Staff Fixtures', result.staffFixtures.male, result.staffFixtures.female) : null}
          {renderFixtureTable('Total', result.totals.male, result.totals.female)}

          {renderFixtureBasis(result.fixtureBasis)}

          <div style={cleanerSinkStyle}>Cleaner's sink: 1 per floor</div>

          {renderDAToiletNote(result.daToilet)}
        </div>
      )
    }

    if (result.typology === 'office') {
      return (
        <div>
          <div style={regTagStyle}>DCPR Table 13, Sr. 6</div>
          <div style={nbcRefStyle}>NBC 2016 Part 9, Table 1</div>
          <div style={resultNumberStyle}>{result.totals.total.wc}</div>
          <div style={resultUnitStyle}>total WCs</div>
          <div style={statLineStyle}>
            Area: {result.area} sq.m &nbsp;|&nbsp; Occupants: {result.totalOccupants} &nbsp;|&nbsp; Male: {result.male} &nbsp;|&nbsp; Female: {result.female}
          </div>

          {renderFixtureTable('Fixtures', result.fixtures.male, result.fixtures.female)}
          {renderFixtureBasis(result.fixtureBasis)}
          {renderUrinalWorking(result.urinalWorking)}

          <div style={cleanerSinkStyle}>Cleaner's sink: 1 per floor</div>

          {renderDAToiletNote(result.daToilet)}
        </div>
      )
    }

    if (result.typology === 'retail') {
      return (
        <div>
          <div style={regTagStyle}>DCPR Table 13, Sr. 5</div>
          <div style={nbcRefStyle}>NBC 2016 Part 9, Table 15</div>
          <div style={resultNumberStyle}>{result.totals.total.wc}</div>
          <div style={resultUnitStyle}>total WCs</div>

          <div style={tableSectionTitleStyle}>Floor Breakdown</div>
          {result.floors.map(function (floor, index) {
            return (
              <div key={index} style={tableRowStyle}>
                <div style={tableLabelCellStyle}>{floor.level === 'street' ? 'Street / Basement' : 'Upper'} &mdash; {floor.area} sq.m</div>
                <div style={tableValueCellStyle}></div>
                <div style={tableValueCellStyle}></div>
                <div style={tableValueCellStyle}>{floor.occupants}</div>
              </div>
            )
          })}

          <div style={statLineStyle}>
            Total occupants: {result.totalOccupants} &nbsp;|&nbsp; Male: {result.male} &nbsp;|&nbsp; Female: {result.female}
          </div>

          {renderFixtureTable('Fixtures', result.fixtures.male, result.fixtures.female)}
          {renderFixtureBasis(result.fixtureBasis)}
          {renderUrinalWorking(result.urinalWorking)}

          <div style={cleanerSinkStyle}>Cleaner's sink: 1 per floor</div>

          {renderDAToiletNote(result.daToilet)}
        </div>
      )
    }

    return null
  }

  return (
    <div>
      <style>{'@media print { .dcpr-print-hide { display: none !important; } }'}</style>

      <div className="dcpr-print-hide">
        <div style={headingStyle}>Toilet Count</div>
        <div style={subheadingStyle}>DCPR Reg 36, Table 13 &middot; Reg 39, Cl. 3.5 &middot; NBC 2016 Part 9</div>
      </div>

      <div style={panelRowStyle}>
        <div className="dcpr-print-hide" style={{ flex: 1 }}>
          <div style={inputsPanelStyle}>
            <div style={sectionLabelStyle}>Project Name</div>
            <input style={inputStyle} type="text" value={projectName} onChange={function (e) { setProjectName(e.target.value) }} />

            <div style={fieldGroupStyle}>
              <div style={sectionLabelStyle}>Typology</div>
              <select style={selectStyle} value={typology} onChange={handleTypologyChange}>
                <option value="school">School / Educational</option>
                <option value="office">Office</option>
                <option value="retail">Retail / Shopping Mall</option>
              </select>
            </div>

            {typology === 'school' ? (
              <div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Total Plinth / Covered Area (sq.m)</div>
                  <input style={inputStyle} type="number" value={schoolArea} onChange={function (e) { setSchoolArea(e.target.value) }} />
                </div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Boys % (Girls % = remainder)</div>
                  <input style={inputStyle} type="number" value={boysPercent} onChange={function (e) { setBoysPercent(e.target.value) }} />
                </div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Staff % of Total Occupants (optional)</div>
                  <input style={inputStyle} type="number" value={staffPercent} onChange={function (e) { setStaffPercent(e.target.value) }} />
                </div>
                {staffPercent !== '' ? (
                  <div style={fieldGroupStyle}>
                    <div style={sectionLabelStyle}>Staff Male % (Female % = remainder)</div>
                    <input style={inputStyle} type="number" value={staffMalePercent} onChange={function (e) { setStaffMalePercent(e.target.value) }} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {typology === 'office' ? (
              <div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Total Plinth / Covered Area (sq.m)</div>
                  <input style={inputStyle} type="number" value={officeArea} onChange={function (e) { setOfficeArea(e.target.value) }} />
                </div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Male % (Female % = remainder)</div>
                  <input style={inputStyle} type="number" value={officeMalePercent} onChange={function (e) { setOfficeMalePercent(e.target.value) }} />
                </div>
              </div>
            ) : null}

            {typology === 'retail' ? (
              <div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Floors</div>
                  {floors.map(function (floor, index) {
                    return (
                      <div key={index} style={floorRowStyle}>
                        <select style={selectStyle} value={floor.level} onChange={function (e) { handleFloorLevelChange(index, e.target.value) }}>
                          <option value="street">Street / Basement</option>
                          <option value="upper">Upper</option>
                        </select>
                        <input style={inputStyle} type="number" placeholder="Area sq.m" value={floor.area} onChange={function (e) { handleFloorAreaChange(index, e.target.value) }} />
                        <span style={removeFloorStyle} onClick={function () { handleRemoveFloor(index) }}>Remove</span>
                      </div>
                    )
                  })}
                  <button type="button" style={secondaryButtonStyle} onClick={handleAddFloor}>+ Add Floor</button>
                </div>
                <div style={fieldGroupStyle}>
                  <div style={sectionLabelStyle}>Male % (Female % = remainder)</div>
                  <input style={inputStyle} type="number" value={retailMalePercent} onChange={function (e) { setRetailMalePercent(e.target.value) }} />
                </div>
              </div>
            ) : null}

            <div style={basisLineStyle}>
              <span style={basisPrefixStyle}>BASIS</span>
              DCPR 2034, Reg 36 &amp; 39, NBC 2016 Part 9
            </div>

            <button type="button" style={buttonStyle} onClick={handleCalculate}>Calculate</button>
          </div>
        </div>

        <div style={resultsPanelStyle}>
          {result ? (
            <div>
              <div style={projectNameLineStyle}>{projectName === '' ? 'Untitled Project' : projectName}</div>
              <div style={calculationDateLineStyle}>Date of calculation: {calculationDate}</div>

              {renderResult()}

              <div style={footerDividerStyle}></div>
              <div style={regulationLineStyle}>REGULATION: DCPR Reg 36, Table 13 &middot; Reg 39, Cl. 3.5 &middot; NBC 2016 Part 9</div>

              <div className="dcpr-print-hide">
                <button type="button" style={pdfButtonStyle} onClick={handleDownloadPdf}>Download PDF</button>
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

export default Toilets
