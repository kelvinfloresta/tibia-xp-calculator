const {
  scenarios,
  rawXpPartyPerHour,
  rawXpSoloPerHour,
  xpMultiplier
} = require('./scenarios')

const { printTable } = require('console-table-printer')
const { format } = require('mathjs')

function calculateFullXP ({ rawXpPerhour, huntingHours, bonusHours }) {
  if (huntingHours === 0) {
    return { normal: 0, bonus: 0, total: 0 }
  }

  const normalHours = huntingHours - bonusHours
  const normal = calculateXP({
    huntingHours: normalHours,
    rawXpPerhour,
    multiplier: xpMultiplier
  })

  const bonus = calculateXP({
    huntingHours: bonusHours,
    rawXpPerhour,
    multiplier: xpMultiplier * 1.5
  })

  const total = precision(normal + bonus)

  return { normal, bonus, total }
}

function calculateXP ({ huntingHours, rawXpPerhour, multiplier }) {
  return +format(huntingHours * rawXpPerhour * multiplier, {
    precision: 10
  })
}

function precision (value) {
  return +format(value, {
    precision: 10
  })
}

function formatKK ({ solo, party, total, description }) {
  return {
    description,
    Solo: solo + ' kk',
    Party: party + ' kk',
    Total: total + ' kk'
  }
}

function print (scenarios) {
  const data = scenarios.sort((a, b) => b.total - a.total).map(formatKK)

  console.log('\n\n')
  console.log(`XP/h PT: ${rawXpPartyPerHour}kk`)
  console.log(`XP/h Solo: ${rawXpSoloPerHour}kk`)
  console.log('\n')
  printTable(data)
  console.log('\n\n')
}

function split ({ hoursSolo, hoursParty, bonusHoursParty, bonusHoursSolo }) {
  const { total: soloTotal } = calculateFullXP({
    rawXpPerhour: rawXpSoloPerHour,
    bonusHours: bonusHoursSolo,
    huntingHours: hoursSolo
  })

  const { total: partyTotal } = calculateFullXP({
    rawXpPerhour: rawXpPartyPerHour,
    bonusHours: bonusHoursParty,
    huntingHours: hoursParty
  })

  const description = `${hoursSolo} horas solo + ${hoursParty} horas PT`

  return {
    party: partyTotal,
    solo: soloTotal,
    total: soloTotal + partyTotal,
    description
  }
}

print(scenarios.map(split))
