import React, { useEffect, useMemo, useState } from 'react';

import Card from 'antd/es/card';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import Typography from 'antd/es/typography';
import Column from 'antd/es/table/Column';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Space from 'antd/es/space';
import styled from 'styled-components';

import { HuntCalculator } from './logic/HuntCalculator';


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
	const [antdForm] = useForm();

	useEffect(() => {
		console.log(form);

		antdForm.setFieldsValue(form);
	}, [antdForm, form]);

	useEffect(() => {
		const calculator = new HuntCalculator(
			form.rawXpPartyPerHour?.replaceAll(',', '.'),
			form.rawXpSoloPerHour?.replaceAll(',', '.'),
		);
		setCalculator(calculator);
	}, [form.rawXpPartyPerHour, form.rawXpSoloPerHour]);

	function onChange({ name, value }: { name: string; value: string }) {
		const newForm = { ...form, [name]: value };
		setForm(newForm);
	}

	const result = useMemo(() => {
		const result = calculator?.calculate({
			hoursSolo: form.huntHours?.replaceAll(',', '.'),
			hoursParty: form.huntHours?.replaceAll(',', '.'),
			bonusHoursParty: form.bonusHours?.replaceAll(',', '.') || 0,
			bonusHoursSolo: form.bonusHours?.replaceAll(',', '.') || 0,
		});

		return result || {};
	}, [calculator, form.bonusHours, form.huntHours]);

	return (
		<Background>
			<Card style={{ maxWidth: 600, margin: '0 auto' }}>
				<Form
					onChange={(e: any) => onChange(e.nativeEvent.target)}
					style={{ maxWidth: 600 }}
					labelAlign="left"
					validateTrigger="onBlur"
					autoComplete="off"
					layout="vertical"
					form={antdForm}
				>
					<Space size={64} direction="horizontal">
						<div>
							<Form.Item label="Raw XP/h">
								<Input name="rawXpSoloPerHour" addonBefore="Solo" />
							</Form.Item>
							<Form.Item
								label="Horas de hunt?"
								name="huntHours"
								style={{ marginBottom: '4rem' }}
								tooltip={
									<>
										Preencha aqui quantas horas pretende caçar por dia. <br />
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
							<Form.Item label="Raw XP/h">
								<Input name="rawXpPartyPerHour" addonBefore="Party" />
							</Form.Item>

							<Form.Item
								label="Horas stamina verde?"
								name="bonusHours"
								style={{ marginBottom: '4rem' }}
								dependencies={["huntHours"]}
								rules={[
									{
										validator: async () => {
											if (!form.huntHours || !form.bonusHours) {
												return;
											}

											const huntHours = +form.huntHours.replaceAll(',', '.');
											if (isNaN(huntHours)) {
												return;
											}

											const bonusHours = +form.huntHours.replaceAll(',', '.');
											if (huntHours >= bonusHours) {
												return;
											}

											throw new Error(
												'Não pode ser maior que a quantidade de horas de hunt',
											);
										},
									},
								]}
								tooltip={
									<>
										Preencha aqui quantas horas de stamina verde pretende caçar.
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

				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						width: '100%',
						marginTop: '1.5rem',
					}}
				>
					<Button type="primary" onClick={() => antdForm.resetFields()}>
						Reset
					</Button>
				</div>
			</Card>
		</Background>
	);
}

export default App;
