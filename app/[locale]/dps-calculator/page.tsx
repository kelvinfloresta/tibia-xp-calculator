'use client';

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useState } from "react";

const data = [
    {
        id: "cobra-bastion",
        name: "Cobra bastion",
        monsters: [
            {
                name: "Cobra Assassin",
                hp: 8200,
                xp: 6968,
                killPerHunt: 351,
            },
            {
                name: "Cobra Scout",
                hp: 8500,
                xp: 7310,
                killPerHunt: 582,
            },
            {
                name: "Cobra Vizier",
                hp: 8500,
                xp: 7650,
                killPerHunt: 113,
            },
        ]
    },
]



export default function DPSCalculator() {
    const [selectedHunt, setSelectedHunt] = useState<string>("cobra-bastion");
    const [lureAmount, setLureAmount] = useState(8);
    const t = useTranslations('DpsCalculator');
    const common = useTranslations('common');
    const [xpGoal, setXpGoal] = useState(7 * 10 ** 6);

    const hunt = data.find((hunt) => hunt.id === selectedHunt);
    const sumKills = hunt?.monsters.reduce((acc, monster) => acc + monster.killPerHunt, 0) ?? 0;

    const xpPerBox = hunt?.monsters.reduce((acc, monster) => acc + monster.xp * monster.killPerHunt/sumKills * lureAmount, 0) ?? 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mx-auto flex flex-col max-w-xl justify-center">
                <Heading className="text-center">{t('title')}</Heading>

                <div>
                    <Select value={selectedHunt} onValueChange={setSelectedHunt}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('selectHunt')} />
                        </SelectTrigger>
                        <SelectContent>
                            {data.map((hunt) => (
                                <SelectItem key={hunt.id} value={hunt.id}>
                                    {hunt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {hunt && (
                    <>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{common('name')}</TableHead>
                        <TableHead>hp</TableHead>
                        <TableHead>xp</TableHead>
                        <TableHead>{t('proportion')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hunt.monsters.map((monster) => (
                            <TableRow key={monster.name}>
                                <TableCell>{monster.name}</TableCell>
                                <TableCell>{monster.hp}</TableCell>
                                <TableCell>{monster.xp}</TableCell>
                                <TableCell>{(monster.killPerHunt/sumKills*100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                        <Text className="mt-4 flex items-center gap-2" as="p">
                            {t.rich('whenYouKill', { 
                                monsters: () => <Input className="w-12" value={lureAmount} onChange={e => setLureAmount(+e.target.value)} />,
                                xp: () => Math.ceil(xpPerBox) + 'xp'
                            })}
                        </Text>

                        <Text as="p">
                            {t.rich('toAchieve', {
                                xp: () => <Input className="inline-block w-24" value={xpGoal} onChange={e => setXpGoal(+e.target.value)} />,
                                time: () => (60*60/(xpGoal/xpPerBox)).toFixed(2),
                            })}
                        </Text>
                    </>
                )}
            </div>
        </div>
    );
}
