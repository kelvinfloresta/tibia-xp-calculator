const { HuntCalculator } = require('./HuntCalculator')
const { scenarios, rawXpPartyPerHour, rawXpSoloPerHour } = require('./scenarios')

function main () {
  const calculator = new HuntCalculator({ rawXpPartyPerHour, rawXpSoloPerHour })

  const result = calculator.batchCalculate(scenarios)

  calculator.print(result)
}

main()
