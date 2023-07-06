import React, { useEffect, useMemo, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import Typography from 'antd/es/typography';
import Column from 'antd/es/table/Column';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Space from 'antd/es/space';
import TimePicker from 'antd/es/time-picker';
import Radio from 'antd/es/radio';
import { HuntCalculator } from '../logic/HuntCalculator';
import { BonusEvent } from '../logic/BonusEvent';

function render(e: any) {
	if (!e || isNaN(e)) {
		return '-';
	}

	return e + ' kk';
}

function toHours(timeField: any): number {
	if (!timeField) {
		return 0;
	}

	return timeField.hour() + timeField.minute() / 60;
}

const INITIAL_FORM = {
	amountOfDays: '1',
	bonusEvent: BonusEvent.none.toString(),
};

export function SoloVsParty() {
	const [form, setForm] = useState<any>(INITIAL_FORM);
	const [antdForm] = useForm();

	useEffect(() => {
		antdForm.setFieldsValue(form);
	}, [antdForm, form]);

	function onChange({ name, value }: { name: string; value: any }) {
		const newForm = { ...form, [name]: value };
		setForm(newForm);
	}

	function formatTime(time: number) {
		if (typeof time !== 'number' || isNaN(time)) {
			return '';
		}

		var n = new Date(0, 0);
		n.setSeconds(time * 60 * 60);

		if (time < 24) {
			return n.toTimeString().slice(0, 5);
		}

		const days = Math.floor(time / 24);
		const formatedTime = time % 24 === 0 ? '' : n.toTimeString().slice(0, 5);
		return `${days} dia(s) ${formatedTime}`;
	}

	const result = useMemo(() => {
		const huntHours = toHours(form.huntHours);
		const bonusHours = toHours(form.bonusHours);

		const { total: party } = HuntCalculator.calculate({
			rawXpPerHour: form.rawXpPartyPerHour?.replaceAll(',', '.'),
			huntingHours: huntHours * form.amountOfDays,
			staminaBonusHours: bonusHours * form.amountOfDays,
			bonusEvent: form.bonusEvent,
		});

		const rawXpSoloPerHour = +form.rawXpSoloPerHour?.replaceAll(',', '.');
		const { total: solo } = HuntCalculator.calculate({
			rawXpPerHour: rawXpSoloPerHour,
			huntingHours: huntHours * form.amountOfDays,
			staminaBonusHours: bonusHours * form.amountOfDays,
			bonusEvent: form.bonusEvent,
		});

		const diff = HuntCalculator.calculateDiff({
			worseXpPerHour: rawXpSoloPerHour,
			totalBetterXp: party,
			totalWorseXp: solo,
			bonusEvent: form.bonusEvent,
		});

		return { solo, party, diff };
	}, [
		form.huntHours,
		form.bonusHours,
		form.rawXpPartyPerHour,
		form.bonusEvent,
		form.rawXpSoloPerHour,
		form.amountOfDays,
	]);

	const isValid = result.solo > 0 && result.party > 0;
	return (
		<>
			<Form
				onChange={(e: any) => onChange(e.nativeEvent.target)}
				labelAlign="left"
				autoComplete="off"
				layout="vertical"
				initialValues={INITIAL_FORM}
				form={antdForm}
			>
				<Space direction="horizontal" style={{ width: '100%' }}>
					<div>
						<Form.Item
							label="Raw XP/h"
							name="rawXpSoloPerHour"
							wrapperCol={{ span: 12 }}
						>
							<Input
								name="rawXpSoloPerHour"
								addonBefore="Solo"
								addonAfter="kk"
								inputMode="numeric"
							/>
						</Form.Item>
						<Form.Item
							label="Horas de hunt?"
							name="huntHours"
							tooltip={
								<>
									Preencha aqui quantas horas pretende caçar por dia.
									<br />
									<br />{' '}
									<Typography.Text type="warning">
										Independente se for solo ou em party
									</Typography.Text>
								</>
							}
						>
							<TimePicker
								changeOnBlur
								inputReadOnly
								onChange={value => onChange({ name: 'huntHours', value })}
								placeholder=""
								showNow={false}
								format="HH:mm"
								name="huntHours"
								hideDisabledOptions
								disabledTime={() => ({
									disabledHours: () => [0],
								})}
							/>
						</Form.Item>
					</div>

					<div>
						<Form.Item
							label="Raw XP/h"
							name="rawXpPartyPerHour"
							wrapperCol={{ span: 12 }}
						>
							<Input
								name="rawXpPartyPerHour"
								addonBefore="Party"
								addonAfter="kk"
								inputMode="numeric"
							/>
						</Form.Item>

						<Form.Item
							label="Horas stamina verde?"
							name="bonusHours"
							dependencies={['huntHours']}
							rules={[
								{
									validator: async () => {
										if (!form.huntHours || !form.bonusHours) {
											return;
										}

										const huntHours = form.huntHours
											.toDate()
											.toISOString()
											.slice(0, -5);
										const bonusHours = form.bonusHours
											.toDate()
											.toISOString()
											.slice(0, -5);
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
							<TimePicker
								changeOnBlur
								inputReadOnly
								onChange={value => onChange({ name: 'bonusHours', value })}
								placeholder=""
								showNow={false}
								hideDisabledOptions
								disabledTime={() => ({
									disabledHours: () => [
										4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
										20, 21, 22, 23,
									],
								})}
								format="HH:mm"
							/>
						</Form.Item>
					</div>
				</Space>

				<div style={{ width: '100%' }}>
					<Form.Item label="Evento?" name="bonusEvent">
						<Radio.Group name="bonusEvent">
							<Radio value={BonusEvent.half.toString()}>Bonus XP (50%)</Radio>
							<Radio value={BonusEvent.double.toString()}>
								Double XP (100%)
							</Radio>
							<Radio value={BonusEvent.none.toString()}>Sem evento</Radio>
						</Radio.Group>
					</Form.Item>
				</div>

				{isValid && (
					<>
						<Table
							rowKey="solo"
							dataSource={[result]}
							pagination={false}
							style={{ marginTop: '2rem' }}
						>
							<Column dataIndex="solo" title="XP Solo" render={render}></Column>

							<Column
								dataIndex="party"
								title="XP Party"
								render={render}
							></Column>
							<Column
								title="Diferença de XP"
								render={x => render(x.solo - x.party)}
							></Column>
							<Column
								dataIndex="diff"
								title="Horas para compensar"
								render={formatTime}
							></Column>
						</Table>
						<Space style={{ marginTop: '1rem' }}>
							<Form.Item name="amountOfDays">
								<Radio.Group name="amountOfDays">
									<Radio value="1">Por dia</Radio>
									<Radio value="30">Por mês</Radio>
								</Radio.Group>
							</Form.Item>
						</Space>
					</>
				)}
			</Form>

			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					width: '100%',
					marginTop: '1.5rem',
				}}
			>
				<Button
					type="primary"
					onClick={() => {
						antdForm.resetFields();
						setForm({});
					}}
				>
					Reset
				</Button>
			</div>
		</>
	);
}
