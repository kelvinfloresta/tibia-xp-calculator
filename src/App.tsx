import React, { useEffect, useMemo, useState } from 'react';

import Card from 'antd/lib/card';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';

import styled from 'styled-components';
import { Space, Table, Typography } from 'antd';
import { HuntCalculator } from './logic/HuntCalculator';
import Column from 'antd/es/table/Column';

const Background = styled.div`
	padding-top: 10vh;
	margin: 0 auto;
	height: 100vh;
	box-sizing: border-box;
	width: 100%;
	background-color: #dcdcdc;
`;

function render(e: any) {
	if (!e || isNaN(e)) {
		return '-';
	}

	return e + ' kk';
}

function App() {
	const [form, setForm] = useState<any>({});
	const [calculator, setCalculator] = useState<HuntCalculator | null>(null);

	useEffect(() => {
		const calculator = new HuntCalculator(
			form.rawXpPartyPerHour?.replaceAll(",", "."),
			form.rawXpSoloPerHour?.replaceAll(",", "."),
		);
		setCalculator(calculator);
	}, [form.rawXpPartyPerHour, form.rawXpSoloPerHour]);

	function onChange({ name, value }: { name: string; value: string }) {
		const newForm = { ...form, [name]: value };
		setForm(newForm);
	}


	const result = useMemo(() => {
		const result = calculator?.calculate({
			hoursSolo: form.huntHours?.replaceAll(",", "."),
			hoursParty: form.huntHours?.replaceAll(",", "."),
			bonusHoursParty: form.bonusHours?.replaceAll(",", ".") || 0,
			bonusHoursSolo: form.bonusHours?.replaceAll(",", ".") || 0,
		});

		return result || {}
	}, [calculator, form.bonusHours, form.huntHours])

	return (
		<Background>
			<Card style={{ maxWidth: 600, margin: '0 auto' }}>
				<Form
					onChange={(e: any) => onChange(e.nativeEvent.target)}
					style={{ maxWidth: 600 }}
					labelAlign="left"
					autoComplete="off"
				>
					<Space size={64} direction="horizontal">
						<div>
							<Typography.Title style={{ textAlign: 'center' }} level={3}>
								Solo
							</Typography.Title>
							<Form.Item label="Raw XP/h">
								<Input name="rawXpSoloPerHour" type="outline" />
							</Form.Item>

							<Form.Item
								label="Horas de hunt?"
								tooltip={
									<>
										Preencha aqui quantas horas pretende caçar por dia todo.{' '}
										<br />
										<br />{' '}
										<Typography.Text type="warning">
											Independente se for solo ou em party
										</Typography.Text>
									</>
								}
							>
								<Input name="huntHours" />
							</Form.Item>
						</div>
						<div>
							<Typography.Title style={{ textAlign: 'center' }} level={3}>
								Party
							</Typography.Title>
							<Form.Item label="Raw XP/h">
								<Input name="rawXpPartyPerHour" />
							</Form.Item>
							<Form.Item
								label="Horas stamina verde?"
								tooltip={
									<>
										Preencha aqui quantas horas de stamina pretende caçar.
										<br /> <br />
										Ex: caso tenha{' '}
										<Typography.Text type="warning">
											42 horas de stamina
										</Typography.Text>
										, preencha com o valor{' '}
										<Typography.Text type="warning">3</Typography.Text>
									</>
								}
							>
								<Input name="bonusHours" />
							</Form.Item>
						</div>
					</Space>
				</Form>

				<Table dataSource={[result]} pagination={false}>
					<Column dataIndex="solo" title="XP Solo" render={render}></Column>
					<Column dataIndex="diff" title="Horas a mais"></Column>
					<Column dataIndex="party" title="XP Party" render={render}></Column>
				</Table>
			</Card>
		</Background>
	);
}

export default App;
