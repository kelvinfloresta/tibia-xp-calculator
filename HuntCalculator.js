const { printTable } = require('console-table-printer')
const { format } = require('mathjs')

class HuntCalculator {
  #xpMultiplier = 1
  #bonusXpMultiplier = 1.5

  constructor ({ rawXpPartyPerHour, rawXpSoloPerHour }) {
    this.rawXpPartyPerHour = rawXpPartyPerHour
    this.rawXpSoloPerHour = rawXpSoloPerHour
    this.calculate = this.calculate.bind(this)
  }

  #calculateFullXP ({ rawXpPerhour, huntingHours, bonusHours }) {
    if (huntingHours === 0) {
      return { normal: 0, bonus: 0, total: 0 }
    }

    const normalHours = huntingHours - bonusHours
    const normal = this.#calculateXP({
      huntingHours: normalHours,
      rawXpPerhour,
      multiplier: this.#xpMultiplier
    })

    const bonus = this.#calculateXP({
      huntingHours: bonusHours,
      rawXpPerhour,
      multiplier: this.#xpMultiplier * this.#bonusXpMultiplier
    })

    const total = normal + bonus

    return { normal, bonus, total }
  }

  #calculateXP ({ huntingHours, rawXpPerhour, multiplier }) {
    return huntingHours * rawXpPerhour * multiplier
  }

  #format (value) {
    return +format(value, {
      precision: 10
    })
  }

  #formatKK ({ solo, party, total, description }) {
    return {
      description,
      Solo: solo + ' kk',
      Party: party + ' kk',
      Total: total + ' kk'
    }
  }

  print (calculatedScenarios) {
    const data = calculatedScenarios.sort((a, b) => b.total - a.total).map(this.#formatKK)

    console.log('\n\n')
    console.log(`XP/h PT: ${this.rawXpPartyPerHour}kk`)
    console.log(`XP/h Solo: ${this.rawXpSoloPerHour}kk`)
    console.log('\n')
    printTable(data)
    console.log('\n\n')
  }

  calculate ({ hoursSolo, hoursParty, bonusHoursParty, bonusHoursSolo }) {
    const { total: soloTotal } = this.#calculateFullXP({
      rawXpPerhour: this.rawXpSoloPerHour,
      bonusHours: bonusHoursSolo,
      huntingHours: hoursSolo
    })

    const { total: partyTotal } = this.#calculateFullXP({
      rawXpPerhour: this.rawXpPartyPerHour,
      bonusHours: bonusHoursParty,
      huntingHours: hoursParty
    })

    const description = `${hoursSolo} horas solo + ${hoursParty} horas PT`

    return {
      party: this.#format(partyTotal),
      solo: this.#format(soloTotal),
      total: this.#format(soloTotal + partyTotal),
      description
    }
  }

  batchCalculate (scenarios) {
    return scenarios.map(this.calculate)
  }
}

exports.HuntCalculator = HuntCalculator
