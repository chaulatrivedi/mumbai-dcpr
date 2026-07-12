import toiletRates from '../data/toiletRates.json' with { type: 'json' }

var ZERO_FIXTURES = { wc: 0, urinal: 0, washbasin: 0, drinkingWater: 0 }

// Occupant load — DCPR Table 13. Uses standard rounding (verified against brief worked
// examples: 5433 sqm office → 543.3 → 543, not 544 — this is population headcount rounding,
// distinct from the "always round up" rule that governs fixture counts below.
export function getOccupantLoad(area, type, floorLevel) {
  if (type === 'school') {
    return Math.round((area / 100) * toiletRates.occupantLoad.school)
  }
  if (type === 'office') {
    return Math.round((area / 100) * toiletRates.occupantLoad.office)
  }
  if (type === 'retail') {
    var rate = floorLevel === 'street' ? toiletRates.occupantLoad.retail_street : toiletRates.occupantLoad.retail_upper
    return Math.round((area / 100) * rate)
  }
  return 0
}

// Split a population into a primary group (rounded) and a complementary group (remainder),
// matching the brief's worked examples (e.g. 1781 students @ 50/50 → Boys 891, Girls 890).
export function splitPopulation(total, primaryPercent) {
  var primary = Math.round(total * (primaryPercent / 100))
  var secondary = total - primary
  return { primary: primary, secondary: secondary }
}

// Student fixtures — NBC Table 11 (Schools, Non-Residential). gender: 'boys' | 'girls'
// All fixture ratios round up — "per X or part thereof" (Math.ceil)
export function getStudentFixtures(count, gender) {
  if (gender === 'boys') {
    var rates = toiletRates.fixtures.school_boys
    return {
      wc: Math.ceil(count / rates.wc),
      urinal: Math.ceil(count / rates.urinal),
      washbasin: Math.ceil(count / rates.washbasin),
      drinkingWater: Math.ceil(count / rates.drinkingWater)
    }
  }
  var girlRates = toiletRates.fixtures.school_girls
  return {
    wc: Math.ceil(count / girlRates.wc),
    urinal: 0,
    washbasin: Math.ceil(count / girlRates.washbasin),
    drinkingWater: Math.ceil(count / girlRates.drinkingWater)
  }
}

function getSlabValue(slab, count) {
  var i
  for (i = 0; i < slab.length; i = i + 1) {
    if (count >= slab[i].min && count <= slab[i].max) {
      return slab[i].count
    }
  }
  return 0
}

function getSlabRangeLabel(slab, count) {
  var i
  for (i = 0; i < slab.length; i = i + 1) {
    if (count >= slab[i].min && count <= slab[i].max) {
      return slab[i].min + '–' + slab[i].max
    }
  }
  return ''
}

// Explanation line for a single fixture count, shown in the results panel the
// same way urinal slab working is shown — group, fixture, formula, result.
function buildFormulaBasis(group, fixture, count, rate) {
  var value = Math.ceil(count / rate)
  return {
    group: group,
    fixture: fixture,
    formula: '1 per ' + rate + ' — ceil(' + count + ' ÷ ' + rate + ') = ' + value,
    value: value
  }
}

// Retail staff WC count under 100 persons uses NBC Table 15 slab, not a plain rate
function buildSlabBasis(group, fixture, count, slab) {
  var value = getSlabValue(slab, count)
  var rangeLabel = getSlabRangeLabel(slab, count)
  return {
    group: group,
    fixture: fixture,
    formula: 'NBC Table 15 slab (' + count + ' persons, ' + rangeLabel + ' range) = ' + value,
    value: value
  }
}

// Urinal count — NBC Table 1 stepped slab. Base 4 fixed at 71–100, then rate-based
// increments per bracket above 100, each increment rounded up (part thereof).
export function getUrinalCount(maleCount) {
  var steps = [
    { range: 'Up to 6', value: 0 },
    { range: '7–20', value: 1 },
    { range: '21–45', value: 2 },
    { range: '46–70', value: 3 },
    { range: '71–100', value: 4 }
  ]

  var total = 0

  if (maleCount <= 6) {
    total = 0
  } else if (maleCount <= 20) {
    total = 1
  } else if (maleCount <= 45) {
    total = 2
  } else if (maleCount <= 70) {
    total = 3
  } else if (maleCount <= 100) {
    total = 4
  } else {
    total = 4
    var midPersons = (maleCount > 200 ? 200 : maleCount) - 100
    var midValue = Math.ceil(midPersons * 0.03)
    total = total + midValue
    steps.push({ range: '101–200 (' + midPersons + ' persons @ 3%)', value: midValue })

    if (maleCount > 200) {
      var abovePersons = maleCount - 200
      var aboveValue = Math.ceil(abovePersons * 0.025)
      total = total + aboveValue
      steps.push({ range: '201–' + maleCount + ' (' + abovePersons + ' persons @ 2.5%)', value: aboveValue })
    }
  }

  return { steps: steps, total: total }
}

// Office fixtures — NBC Table 1. gender: 'male' | 'female'
export function getOfficeFixtures(count, gender) {
  if (gender === 'male') {
    var rates = toiletRates.fixtures.office_male
    return {
      wc: Math.ceil(count / rates.wc),
      urinal: getUrinalCount(count).total,
      washbasin: Math.ceil(count / rates.washbasin),
      drinkingWater: Math.ceil(count / rates.drinkingWater)
    }
  }
  var femaleRates = toiletRates.fixtures.office_female
  return {
    wc: Math.ceil(count / femaleRates.wc),
    urinal: 0,
    washbasin: Math.ceil(count / femaleRates.washbasin),
    drinkingWater: Math.ceil(count / femaleRates.drinkingWater)
  }
}

// Retail / Shopping Mall fixtures — NBC Table 15 (staff ≤ 100) or Table 1 (staff > 100).
// Table 15 only tabulates WC counts (see brief §6 "NBC Table 15 Staff WC slab") — urinal,
// washbasin and drinking water always follow Table 1 rates, as no alternate rate is given.
// gender: 'male' | 'female'
export function getRetailFixtures(count, gender) {
  var officeFixtures = getOfficeFixtures(count, gender)

  if (count > 100) {
    return officeFixtures
  }

  var slab = gender === 'male' ? toiletRates.retailStaffWcSlab.male : toiletRates.retailStaffWcSlab.female
  var wc = getSlabValue(slab, count)

  return {
    wc: wc,
    urinal: officeFixtures.urinal,
    washbasin: officeFixtures.washbasin,
    drinkingWater: officeFixtures.drinkingWater
  }
}

function addFixtures(a, b) {
  return {
    wc: a.wc + b.wc,
    urinal: a.urinal + b.urinal,
    washbasin: a.washbasin + b.washbasin,
    drinkingWater: a.drinkingWater + b.drinkingWater
  }
}

// Combine student/staff fixture sets into male, female and grand totals
export function getTotalFixtures(studentM, studentF, staffM, staffF) {
  var male = addFixtures(studentM, staffM)
  var female = addFixtures(studentF, staffF)
  var total = addFixtures(male, female)
  return { male: male, female: female, total: total }
}

// DA toilet — mandatory note on every output, DCPR Reg 39, Cl. 3.5
export function getDAToiletNote() {
  return toiletRates.da_toilet
}

// School — Day (Non-Residential). Staff % optional; when omitted, full occupant count
// is split boys/girls and no staff fixtures are calculated.
export function calcSchoolToilets(area, boysPercent, girlsPercent, staffPercent, staffMalePercent, staffFemalePercent) {
  var totalOccupants = getOccupantLoad(area, 'school', null)

  var staffCount = 0
  var studentCount = totalOccupants

  if (staffPercent > 0) {
    var staffSplit = splitPopulation(totalOccupants, staffPercent)
    staffCount = staffSplit.primary
    studentCount = staffSplit.secondary
  }

  var boysSplit = splitPopulation(studentCount, boysPercent)
  var boys = boysSplit.primary
  var girls = boysSplit.secondary

  var studentBoysFixtures = getStudentFixtures(boys, 'boys')
  var studentGirlsFixtures = getStudentFixtures(girls, 'girls')

  var staffMaleFixtures = ZERO_FIXTURES
  var staffFemaleFixtures = ZERO_FIXTURES
  var staffMale = 0
  var staffFemale = 0

  if (staffPercent > 0) {
    var staffGenderSplit = splitPopulation(staffCount, staffMalePercent)
    staffMale = staffGenderSplit.primary
    staffFemale = staffGenderSplit.secondary
    staffMaleFixtures = getOfficeFixtures(staffMale, 'male')
    staffFemaleFixtures = getOfficeFixtures(staffFemale, 'female')
  }

  var urinalWorking = getUrinalCount(staffMale)
  var totals = getTotalFixtures(studentBoysFixtures, studentGirlsFixtures, staffMaleFixtures, staffFemaleFixtures)

  var fixtureBasis = [
    buildFormulaBasis('Boys', 'WC', boys, toiletRates.fixtures.school_boys.wc),
    buildFormulaBasis('Boys', 'Wash basin', boys, toiletRates.fixtures.school_boys.washbasin),
    buildFormulaBasis('Girls', 'WC', girls, toiletRates.fixtures.school_girls.wc),
    buildFormulaBasis('Girls', 'Wash basin', girls, toiletRates.fixtures.school_girls.washbasin)
  ]
  if (staffPercent > 0) {
    fixtureBasis.push(buildFormulaBasis('Staff Male', 'WC', staffMale, toiletRates.fixtures.office_male.wc))
    fixtureBasis.push(buildFormulaBasis('Staff Male', 'Wash basin', staffMale, toiletRates.fixtures.office_male.washbasin))
    fixtureBasis.push(buildFormulaBasis('Staff Female', 'WC', staffFemale, toiletRates.fixtures.office_female.wc))
    fixtureBasis.push(buildFormulaBasis('Staff Female', 'Wash basin', staffFemale, toiletRates.fixtures.office_female.washbasin))
  }

  return {
    typology: 'school',
    area: area,
    totalOccupants: totalOccupants,
    staffCount: staffCount,
    studentCount: studentCount,
    boys: boys,
    girls: girls,
    staffMale: staffMale,
    staffFemale: staffFemale,
    studentFixtures: { boys: studentBoysFixtures, girls: studentGirlsFixtures },
    staffFixtures: { male: staffMaleFixtures, female: staffFemaleFixtures },
    staffEntered: staffPercent > 0,
    urinalWorking: urinalWorking,
    fixtureBasis: fixtureBasis,
    totals: totals,
    daToilet: getDAToiletNote()
  }
}

// Office
export function calcOfficeToilets(area, malePercent) {
  var totalOccupants = getOccupantLoad(area, 'office', null)
  var split = splitPopulation(totalOccupants, malePercent)
  var male = split.primary
  var female = split.secondary

  var maleFixtures = getOfficeFixtures(male, 'male')
  var femaleFixtures = getOfficeFixtures(female, 'female')
  var urinalWorking = getUrinalCount(male)
  var totals = getTotalFixtures(maleFixtures, femaleFixtures, ZERO_FIXTURES, ZERO_FIXTURES)

  var fixtureBasis = [
    buildFormulaBasis('Male', 'WC', male, toiletRates.fixtures.office_male.wc),
    buildFormulaBasis('Male', 'Wash basin', male, toiletRates.fixtures.office_male.washbasin),
    buildFormulaBasis('Female', 'WC', female, toiletRates.fixtures.office_female.wc),
    buildFormulaBasis('Female', 'Wash basin', female, toiletRates.fixtures.office_female.washbasin)
  ]

  return {
    typology: 'office',
    area: area,
    totalOccupants: totalOccupants,
    male: male,
    female: female,
    fixtures: { male: maleFixtures, female: femaleFixtures },
    urinalWorking: urinalWorking,
    fixtureBasis: fixtureBasis,
    totals: totals,
    daToilet: getDAToiletNote()
  }
}

// Retail / Shopping Mall — floors: [{ level: 'street' | 'upper', area: n }, ...]
export function calcRetailToilets(floors, malePercent) {
  var floorResults = []
  var totalOccupants = 0
  var i

  for (i = 0; i < floors.length; i = i + 1) {
    var floorLoad = getOccupantLoad(floors[i].area, 'retail', floors[i].level)
    totalOccupants = totalOccupants + floorLoad
    floorResults.push({ level: floors[i].level, area: floors[i].area, occupants: floorLoad })
  }

  var split = splitPopulation(totalOccupants, malePercent)
  var male = split.primary
  var female = split.secondary

  var maleFixtures = getRetailFixtures(male, 'male')
  var femaleFixtures = getRetailFixtures(female, 'female')
  var urinalWorking = male > 100 ? getUrinalCount(male) : null
  var totals = getTotalFixtures(maleFixtures, femaleFixtures, ZERO_FIXTURES, ZERO_FIXTURES)

  var fixtureBasis = []
  if (male > 100) {
    fixtureBasis.push(buildFormulaBasis('Male', 'WC', male, toiletRates.fixtures.office_male.wc))
  } else {
    fixtureBasis.push(buildSlabBasis('Male', 'WC', male, toiletRates.retailStaffWcSlab.male))
  }
  fixtureBasis.push(buildFormulaBasis('Male', 'Wash basin', male, toiletRates.fixtures.office_male.washbasin))
  if (female > 100) {
    fixtureBasis.push(buildFormulaBasis('Female', 'WC', female, toiletRates.fixtures.office_female.wc))
  } else {
    fixtureBasis.push(buildSlabBasis('Female', 'WC', female, toiletRates.retailStaffWcSlab.female))
  }
  fixtureBasis.push(buildFormulaBasis('Female', 'Wash basin', female, toiletRates.fixtures.office_female.washbasin))

  return {
    typology: 'retail',
    floors: floorResults,
    totalOccupants: totalOccupants,
    male: male,
    female: female,
    fixtures: { male: maleFixtures, female: femaleFixtures },
    urinalWorking: urinalWorking,
    fixtureBasis: fixtureBasis,
    totals: totals,
    daToilet: getDAToiletNote()
  }
}

// Master dispatcher
export function calcToilets(typology, inputs) {
  if (typology === 'school') {
    return calcSchoolToilets(inputs.area, inputs.boysPercent, inputs.girlsPercent, inputs.staffPercent, inputs.staffMalePercent, inputs.staffFemalePercent)
  }
  if (typology === 'office') {
    return calcOfficeToilets(inputs.area, inputs.malePercent)
  }
  if (typology === 'retail') {
    return calcRetailToilets(inputs.floors, inputs.malePercent)
  }
  return null
}
