import parkingRates from '../data/parkingRates.json' with { type: 'json' }

// Round fraction per Reg 44(2) — fractions above 0.5 round up, 0.5 and below round down
export function roundParking(val) {
  var floor = Math.floor(val)
  return (val - floor) > 0.5 ? floor + 1 : floor
}

// Visitor parking — 10% of base, enforced minimum per typology (Reg 44(3))
export function visitorParking(base, minimum) {
  var visitor = roundParking(base * 0.1)
  return visitor < minimum ? minimum : visitor
}

// Transport vehicles — Reg 44(5). 1 per 2000 sq.m, first 400 sq.m excluded, min 1, max 6
export function calcTransportVehicles(area) {
  var applicable = area - 400
  if (applicable <= 0) return 0
  var spaces = roundParking(applicable / 2000)
  return spaces > 6 ? 6 : spaces
}

// Residential — Table 21, Sr. 1(i)
// slabCounts: { upto45: n, to60: n, to90: n, above90: n }
// devType: 'new' | 'redevelopment_33series'
export function calcResidential(slabCounts, devType) {
  var rates = parkingRates.residential
  var devRates = devType === 'new' ? rates.new_development : rates.redevelopment_33series
  var slabs = devRates.slabs

  var upto45Cars = roundParking(slabCounts.upto45 / slabs[0].per_n_tenements)
  var to60Cars = roundParking(slabCounts.to60 / slabs[1].per_n_tenements)
  var to90Cars = roundParking(slabCounts.to90 / slabs[2].per_n_tenements)
  var above90Cars = roundParking(slabCounts.above90 / slabs[3].per_n_tenements)

  var subTotal = upto45Cars + to60Cars + to90Cars + above90Cars
  var visitor = visitorParking(subTotal, rates.visitor_minimum)
  var total = subTotal + visitor

  var totalTenements = slabCounts.upto45 + slabCounts.to60 + slabCounts.to90 + slabCounts.above90
  var twoWheelerOptional = roundParking(totalTenements / 2)

  return {
    typology: 'residential',
    regulation: rates.regulation,
    devType: devType,
    slabs: [
      { label: slabs[0].label, count: slabCounts.upto45, cars: upto45Cars, perN: slabs[0].per_n_tenements },
      { label: slabs[1].label, count: slabCounts.to60, cars: to60Cars, perN: slabs[1].per_n_tenements },
      { label: slabs[2].label, count: slabCounts.to90, cars: to90Cars, perN: slabs[2].per_n_tenements },
      { label: slabs[3].label, count: slabCounts.above90, cars: above90Cars, perN: slabs[3].per_n_tenements }
    ],
    subTotal: subTotal,
    visitor: visitor,
    total: total,
    twoWheelerOptional: twoWheelerOptional,
    transportVehicle: 0
  }
}

// Shopping / Convenience (individual shops) — Table 21, Sr. 10
// Two independent area inputs, both optional:
//   areaUpto20  — built-up area of shops ≤ 20 sq.m (rate 1 / 150 sq.m)
//   areaAbove20 — built-up area of shops > 20 sq.m (rate 1 / 50 sq.m)
// Calculated independently, then summed (Reg 44(2)(3), Table 21 Sr. 10)
export function calcShopping(areaUpto20, areaAbove20) {
  var rates = parkingRates.shopping_convenience
  var rateUpto20 = 150
  var rateAbove20 = 50

  var carsUpto20 = areaUpto20 > 0 ? roundParking(areaUpto20 / rateUpto20) : 0
  var carsAbove20 = areaAbove20 > 0 ? roundParking(areaAbove20 / rateAbove20) : 0

  var cars = carsUpto20 + carsAbove20
  var visitor = visitorParking(cars, rates.visitor_minimum)
  var total = cars + visitor

  var totalArea = areaUpto20 + areaAbove20
  var transportVehicle = calcTransportVehicles(totalArea)

  var slabs = []
  if (areaUpto20 > 0) {
    slabs.push({ label: 'upto_20sqm', area: areaUpto20, rate: rateUpto20, cars: carsUpto20 })
  }
  if (areaAbove20 > 0) {
    slabs.push({ label: 'above_20sqm', area: areaAbove20, rate: rateAbove20, cars: carsAbove20 })
  }

  return {
    typology: 'shopping_convenience',
    regulation: rates.regulation,
    areaUpto20: areaUpto20,
    areaAbove20: areaAbove20,
    slabs: slabs,
    cars: cars,
    visitor: visitor,
    total: total,
    transportVehicle: transportVehicle,
    twoWheelerOptional: total
  }
}

// Mercantile — Table 21, Sr. 5. NIL if area ≤ 50 sq.m
export function calcMercantile(area) {
  var rates = parkingRates.mercantile

  if (area <= rates.nil_exemption_sqm) {
    return {
      typology: 'mercantile',
      regulation: rates.regulation,
      area: area,
      nil: true,
      slabs: [],
      subTotal: 0,
      visitor: 0,
      total: 0,
      transportVehicle: 0,
      twoWheelerOptional: 0
    }
  }

  var slab1Area = area > 800 ? 800 : area
  var slab2Area = area > 800 ? area - 800 : 0

  var slab1Cars = roundParking(slab1Area / rates.slabs[0].rate)
  var slab2Cars = slab2Area > 0 ? roundParking(slab2Area / rates.slabs[1].rate) : 0

  var subTotal = slab1Cars + slab2Cars
  var visitor = visitorParking(subTotal, rates.visitor_minimum)
  var total = subTotal + visitor
  var transportVehicle = calcTransportVehicles(area)

  return {
    typology: 'mercantile',
    regulation: rates.regulation,
    area: area,
    nil: false,
    slabs: [
      { label: 'upto_800sqm', area: slab1Area, cars: slab1Cars, rate: rates.slabs[0].rate },
      { label: 'above_800sqm', area: slab2Area, cars: slab2Cars, rate: rates.slabs[1].rate }
    ],
    subTotal: subTotal,
    visitor: visitor,
    total: total,
    transportVehicle: transportVehicle,
    twoWheelerOptional: total
  }
}

// Office / Commercial — Table 21, Sr. 4
export function calcOffice(area) {
  var rates = parkingRates.office

  var slab1Area = area > 1500 ? 1500 : area
  var slab2Area = area > 1500 ? area - 1500 : 0

  var slab1Cars = roundParking(slab1Area / rates.slabs[0].rate)
  var slab2Cars = slab2Area > 0 ? roundParking(slab2Area / rates.slabs[1].rate) : 0

  var subTotal = slab1Cars + slab2Cars
  var visitor = visitorParking(subTotal, rates.visitor_minimum)
  var total = subTotal + visitor
  var transportVehicle = calcTransportVehicles(area)

  return {
    typology: 'office',
    regulation: rates.regulation,
    area: area,
    slabs: [
      { label: 'upto_1500sqm', area: slab1Area, cars: slab1Cars, rate: rates.slabs[0].rate },
      { label: 'above_1500sqm', area: slab2Area, cars: slab2Cars, rate: rates.slabs[1].rate }
    ],
    subTotal: subTotal,
    visitor: visitor,
    total: total,
    transportVehicle: transportVehicle,
    twoWheelerOptional: total
  }
}

// School — Admin (Sr. 2) + Assembly (Sr. 3a/3b) + Canteen (Sr. 3c → Sr. 5)
// assemblyType: 'fixed' | 'no_fixed' | 'none'
// assemblyValue: seat count if fixed, floor area if no_fixed
export function calcSchool(adminArea, assemblyType, assemblyValue, canteenArea) {
  var rates = parkingRates.school

  // A. Admin / Public Service Area — Sr. 2
  var adminCars = roundParking(adminArea / rates.components.admin.rate)
  var adminVisitor = visitorParking(adminCars, rates.components.admin.visitor_minimum)
  var totalA = adminCars + adminVisitor

  // B. Assembly Hall — Sr. 3(a) fixed seats or Sr. 3(b) no fixed seats
  var assemblyCars = 0
  var assemblyVisitor = 0
  var totalB = 0

  if (assemblyType === 'fixed') {
    assemblyCars = roundParking(assemblyValue / rates.components.assembly_fixed_seats.rate_per_seats)
    assemblyVisitor = visitorParking(assemblyCars, rates.components.assembly_fixed_seats.visitor_minimum)
    totalB = assemblyCars + assemblyVisitor
  } else if (assemblyType === 'no_fixed') {
    assemblyCars = roundParking(assemblyValue / rates.components.assembly_no_fixed_seats.rate_per_sqm)
    assemblyVisitor = visitorParking(assemblyCars, rates.components.assembly_no_fixed_seats.visitor_minimum)
    totalB = assemblyCars + assemblyVisitor
  }

  // C. Canteen / Tiffin Room — Sr. 3(c) → Sr. 5. NIL if ≤ 50 sq.m
  var canteenRates = rates.components.canteen
  var canteenSubTotal = 0
  var canteenVisitor = 0
  var totalC = 0
  var canteenNil = false

  if (canteenArea > 0) {
    if (canteenArea <= canteenRates.nil_exemption_sqm) {
      canteenNil = true
    } else {
      var cSlab1Area = canteenArea > 800 ? 800 : canteenArea
      var cSlab2Area = canteenArea > 800 ? canteenArea - 800 : 0
      var cSlab1Cars = roundParking(cSlab1Area / canteenRates.slabs[0].rate)
      var cSlab2Cars = cSlab2Area > 0 ? roundParking(cSlab2Area / canteenRates.slabs[1].rate) : 0
      canteenSubTotal = cSlab1Cars + cSlab2Cars
      canteenVisitor = visitorParking(canteenSubTotal, canteenRates.visitor_minimum)
      totalC = canteenSubTotal + canteenVisitor
    }
  }

  var grandTotal = totalA + totalB + totalC

  return {
    typology: 'school',
    regulation: rates.regulation,
    admin: { area: adminArea, cars: adminCars, visitor: adminVisitor, total: totalA },
    assembly: { type: assemblyType, value: assemblyValue, cars: assemblyCars, visitor: assemblyVisitor, total: totalB },
    canteen: { area: canteenArea, nil: canteenNil, subTotal: canteenSubTotal, visitor: canteenVisitor, total: totalC },
    grandTotal: grandTotal,
    transportVehicle: 0,
    twoWheelerOptional: grandTotal
  }
}

// Master dispatcher
export function calcParking(typology, inputs) {
  if (typology === 'residential') {
    return calcResidential(inputs.slabCounts, inputs.devType)
  }
  if (typology === 'shopping_convenience') {
    return calcShopping(inputs.areaUpto20, inputs.areaAbove20)
  }
  if (typology === 'mercantile') {
    return calcMercantile(inputs.area)
  }
  if (typology === 'office') {
    return calcOffice(inputs.area)
  }
  if (typology === 'school') {
    return calcSchool(inputs.adminArea, inputs.assemblyType, inputs.assemblyValue, inputs.canteenArea)
  }
  return null
}

// Extracts a component's pre-visitor car sub-total — used only for the mixed-use grand
// total base (Bug fix: visitor must be computed once on the combined total, not per
// component). Each typology's own calcXxx() function is unaffected and still computes
// its own standalone visitor/total per the brief's per-typology worked examples.
function getComponentSubTotal(result) {
  if (result.typology === 'residential') {
    return result.subTotal
  }
  if (result.typology === 'shopping_convenience') {
    return result.cars
  }
  if (result.typology === 'mercantile' || result.typology === 'office') {
    return result.subTotal
  }
  if (result.typology === 'school') {
    return result.admin.cars + result.assembly.cars + result.canteen.subTotal
  }
  return 0
}

// Mixed use — combine independent typology components (Reg 44, Table 21 §8)
// components: [{ typology: '...', inputs: {...} }, ...]
//
// Bug fix: visitor parking is calculated ONCE on the grand total base (sum of every
// component's pre-visitor car sub-total), not per component:
//   1. Each component's sub-total — cars only, no visitor
//   2. Sum all sub-totals = grand total base
//   3. Visitor = roundParking(grand total base × 0.10), minimum 2
//   4. TOTAL CAR PARKING = grand total base + visitor
export function calcMixedUse(components) {
  var results = []
  var grandTotalBase = 0
  var transportTotal = 0
  var i

  for (i = 0; i < components.length; i = i + 1) {
    var result = calcParking(components[i].typology, components[i].inputs)
    results.push(result)
    grandTotalBase = grandTotalBase + getComponentSubTotal(result)
    transportTotal = transportTotal + result.transportVehicle
  }

  var visitor = visitorParking(grandTotalBase, 2)
  var totalCarParking = grandTotalBase + visitor
  var transportVehicle = transportTotal > 6 ? 6 : transportTotal

  return {
    components: results,
    grandTotalBase: grandTotalBase,
    visitor: visitor,
    grandTotal: totalCarParking,
    transportVehicle: transportVehicle,
    twoWheelerOptional: totalCarParking
  }
}
