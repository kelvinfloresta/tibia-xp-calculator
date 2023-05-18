// const { printTable } = require('console-table-printer')
const { format } = require('mathjs')

export class HuntCalculator {
  xpMultiplier = 1
  bonusXpMultiplier = 1.5

  constructor (private rawXpPartyPerHour: number, private rawXpSoloPerHour: number) {
    this.calculate = this.calculate.bind(this)
  }

 private calculateFullXP ({ rawXpPerhour, huntingHours, bonusHours }: any) {
    if (huntingHours === 0) {
      return { normal: 0, bonus: 0, total: 0 }
    }

    const normalHours = huntingHours - bonusHours
    const normal = this.calculateXP({
      huntingHours: normalHours,
      rawXpPerhour,
      multiplier: this.xpMultiplier
    })

    const bonus = this.calculateXP({
      huntingHours: bonusHours,
      rawXpPerhour,
      multiplier: this.xpMultiplier * this.bonusXpMultiplier
    })

    const total = normal + bonus

    return { normal, bonus, total }
  }

  private calculateXP ({ huntingHours, rawXpPerhour, multiplier }: any) {
    return huntingHours * rawXpPerhour * multiplier
  }

  private format (value: number) {
    return +format(value, {
      precision: 10
    })
  }

  private formatKK ({ solo, party, total, description }: any) {
    return {
      description,
      Solo: solo + ' kk',
      Party: party + ' kk',
      Total: total + ' kk'
    }
  }

  public print (calculatedScenarios: any) {
    const data = calculatedScenarios.sort((a: any, b: any) => b.total - a.total).map(this.formatKK)

    console.log('\n\n')
    console.log(`XP/h PT: ${this.rawXpPartyPerHour}kk`)
    console.log(`XP/h Solo: ${this.rawXpSoloPerHour}kk`)
    console.log('\n')
    console.log(data)
    console.log('\n\n')
  }

  public calculate ({ hoursSolo, hoursParty, bonusHoursParty, bonusHoursSolo }: any) {
    const { total: soloTotal } = this.calculateFullXP({
      rawXpPerhour: this.rawXpSoloPerHour,
      bonusHours: bonusHoursSolo,
      huntingHours: hoursSolo
    })

    const { total: partyTotal } = this.calculateFullXP({
      rawXpPerhour: this.rawXpPartyPerHour,
      bonusHours: bonusHoursParty,
      huntingHours: hoursParty
    })

    const description = `${hoursSolo} horas solo + ${hoursParty} horas PT`
    const diff = (partyTotal - soloTotal) / this.rawXpSoloPerHour

    return {
      party: this.format(partyTotal),
      solo: this.format(soloTotal),
      total: this.format(soloTotal + partyTotal),
      description,
      diff: this.formatTime(this.format(diff))
    }
  }

  private formatTime(time: number) {
    if (!time || isNaN(time)) {
      return ""
    }

    var n = new Date(0, 0)
    n.setSeconds(time * 60 * 60)
    return n.toTimeString().slice(0, 5)
  }

  public batchCalculate (scenarios: any) {
    return scenarios.map(this.calculate)
  }

}
