const { HuntCalculator } = require('./HuntCalculator')

describe('HuntCalculator', () => {
  describe('Solo Hunt', () => {
    it('should calculate', () => {
      const calculator = new HuntCalculator({
        rawXpSoloPerHour: 5,
        rawXpPartyPerHour: 0
      })

      const result = calculator.calculate({
        hoursSolo: 1,
        bonusHoursSolo: 0,
        bonusHoursParty: 0,
        hoursParty: 0
      })

      const expected = 5

      calculator.print([result])
      expect(result.total).toBe(expected)
    })

    it('should calculate with bonus', () => {
      const calculator = new HuntCalculator({
        rawXpSoloPerHour: 5,
        rawXpPartyPerHour: 0
      })

      const result = calculator.calculate({
        hoursSolo: 1,
        bonusHoursSolo: 1,
        bonusHoursParty: 0,
        hoursParty: 0
      })

      const expected = 7.5

      calculator.print([result])
      expect(result.total).toBe(expected)
    })

    it('should calculate when have a mix with bonus and no bonus', () => {
      const calculator = new HuntCalculator({
        rawXpSoloPerHour: 5,
        rawXpPartyPerHour: 0
      })

      const result = calculator.calculate({
        hoursSolo: 2,
        bonusHoursSolo: 1,
        bonusHoursParty: 0,
        hoursParty: 0
      })

      const expected = 12.5

      expect(result.total).toBe(expected)
    })
  })

  describe('Party Hunt', () => {
    it('should calculate', () => {
      const calculator = new HuntCalculator({
        rawXpPartyPerHour: 9,
        rawXpSoloPerHour: 0
      })

      const result = calculator.calculate({
        hoursParty: 1,
        bonusHoursParty: 0,
        bonusHoursSolo: 0,
        hoursSolo: 0
      })

      const expected = 9

      calculator.print([result])
      expect(result.total).toBe(expected)
    })

    it('should calculate with bonus', () => {
      const calculator = new HuntCalculator({
        rawXpPartyPerHour: 9,
        rawXpSoloPerHour: 0
      })

      const result = calculator.calculate({
        hoursParty: 1,
        bonusHoursParty: 1,
        bonusHoursSolo: 0,
        hoursSolo: 0
      })

      const expected = 13.5

      calculator.print([result])
      expect(result.total).toBe(expected)
    })

    it('should calculate when have a mix with bonus and no bonus', () => {
      const calculator = new HuntCalculator({
        rawXpPartyPerHour: 9,
        rawXpSoloPerHour: 0
      })

      const result = calculator.calculate({
        hoursParty: 2,
        bonusHoursParty: 1,
        bonusHoursSolo: 0,
        hoursSolo: 0
      })

      const expected = 22.5

      expect(result.total).toBe(expected)
    })
  })
})
