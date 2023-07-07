const kk = 1000000;

const xp = 9 * kk;
function test(params) {
	return params.map(el => ({
		...el,
		amountToKill: Math.ceil((xp / el.xp / 60) * el.proportion),
	}));
}

const result = test([
	{ name: 'Lost Soul', xp: 4500, proportion: .5 },
	{ name: 'Mean Lost Soul', xp: 5580, proportion: .5 },
	// { name: 'Grim Reaper', xp: 5500, proportion: .07 },
]);

console.log(`\nXP desejada: ${xp / kk}kk/h raw`);
console.table(
	result.map(el => ({
		'Nome da criatura': el.name,
		'Quantidade por minuto': el.amountToKill,
		'proporção': el.proportion * 100 + '%',
	})),
);
