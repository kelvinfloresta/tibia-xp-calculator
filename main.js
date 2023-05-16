const { printTable } = require("console-table-printer");
const { bonusHours, scenarios } = require("./scenarios.json")
const rawXpSoloPerHour = 5;
const rawXpPartyPerHour = 9;

const xpMultiplier = 1.5;

function calculateFullXP({ rawXpPerhour, huntingHours, bonusHours }) {
	if (huntingHours === 0) {
  	return { normal: 0, bonus: 0, total: 0 };
	}

  const normalHours = huntingHours - bonusHours;

  const normal = calculateXP({
    huntingHours: normalHours,
    rawXpPerhour,
    multiplier: xpMultiplier,
  });

  const bonus = calculateXP({
    huntingHours: bonusHours,
    rawXpPerhour,
    multiplier: xpMultiplier * 1.5,
  });

  return { normal, bonus, total: normal + bonus };
}

function calculateXP({ huntingHours, rawXpPerhour, multiplier }) {
  return huntingHours * rawXpPerhour * multiplier;
}

function format({ solo, party, total, description }) {
  return {
    description,
    Solo: solo + " kk",
    Party: party + " kk",
    Total: total + " kk",
  };
}

function print(scenarios) {
  const data = scenarios.sort((a, b) => b.total - a.total).map(format);

  printTable(data);
}

function split({ hoursSolo, hoursParty }) {
  const { total: soloTotal } = calculateFullXP({
    rawXpPerhour: rawXpSoloPerHour,
    bonusHours: 0,
    huntingHours: hoursSolo,
  });

  const { total: partyTotal } = calculateFullXP({
    rawXpPerhour: rawXpPartyPerHour,
    bonusHours: bonusHours,
    huntingHours: hoursParty,
  });

	const description = `${hoursSolo} Solo + ${hoursParty} Party`

  return {
    party: partyTotal,
    solo: soloTotal,
    total: soloTotal + partyTotal,
    description,
  };
}

print(scenarios.map(split));
