import React from 'react';
// import React, { useEffect, useMemo, useState } from 'react';
// import Input from 'antd/es/input';
// import Form from 'antd/es/form';
// import { useForm } from 'antd/es/form/Form';
// import Column from 'antd/es/table/Column';
// import Button from 'antd/es/button';
// import Table from 'antd/es/table';
// import Space from 'antd/es/space';
// import TimePicker from 'antd/es/time-picker';
// import Radio from 'antd/es/radio';
// import { HuntCalculator as HuntCalculatorLogic } from '../logic/HuntCalculator';
import Title from 'antd/es/typography/Title';

// function render(e: any) {
// 	if (!e || isNaN(e)) {
// 		return '-';
// 	}

// 	return e + ' kk';
// }

// function toHours(timeField: any): number {
// 	if (!timeField) {
// 		return 0;
// 	}

// 	return timeField.hour() + timeField.minute() / 60;
// }

export function RushCalculator() {
	return (
		<Title
			level={2}
			style={{
				width: '100%',
				textAlign: 'center',
				lineHeight: 10,
			}}
		>
			Em breve
		</Title>
	);
	// const [form, setForm] = useState<any>({});
	// const [calculator, setCalculator] = useState<HuntCalculatorLogic | null>(
	// 	null,
	// );
	// const [antdForm] = useForm();
	// useEffect(() => {
	// 	antdForm.setFieldsValue(form);
	// }, [antdForm, form]);
	// useEffect(() => {
	// 	const calculator = new HuntCalculatorLogic(
	// 		form.rawXpPartyPerHour?.replaceAll(',', '.'),
	// 		form.rawXpSoloPerHour?.replaceAll(',', '.'),
	// 	);
	// 	setCalculator(calculator);
	// }, [form.rawXpPartyPerHour, form.rawXpSoloPerHour]);
	// function onChange({ name, value }: { name: string; value: any }) {
	// 	const newForm = { ...form, [name]: value };
	// 	setForm(newForm);
	// }
	// const result = useMemo(() => {
	// 	const huntHours = toHours(form.huntHours);
	// 	const bonusHours = toHours(form.bonusHours);
	// 	const result = calculator?.calculate({
	// 		hoursSolo: huntHours,
	// 		hoursParty: huntHours,
	// 		bonusHoursParty: bonusHours,
	// 		bonusHoursSolo: bonusHours,
	// 		bonusEvent: form.bonusEvent || 1,
	// 	});
	// 	return result || {};
	// }, [calculator, form.bonusHours, form.huntHours, form.bonusEvent]);
	// return (
	// 	<>
	// 		<Form
	// 			onChange={(e: any) => onChange(e.nativeEvent.target)}
	// 			style={{ maxWidth: 600 }}
	// 			wrapperCol={{ span: 14 }}
	// 			labelAlign="left"
	// 			autoComplete="off"
	// 			layout="vertical"
	// 			form={antdForm}
	// 		>
	// 			<Space size="middle" direction="horizontal">
	// 				<div>
	// 					<Form.Item label="Nivel atual" name="rawXpSoloPerHour">
	// 						<Input
	// 							name="currrentLevel"
	// 							addonBefore="Lv"
	// 							inputMode="numeric"
	// 						/>
	// 					</Form.Item>
	// 					<Form.Item label="XP atual" name="rawXpSoloPerHour">
	// 						<Input name="currrentLevel" addonAfter="xp" inputMode="numeric" />
	// 					</Form.Item>
	// 					<Form.Item
	// 						label="Horas de hunt?"
	// 						name="huntHours"
	// 						tooltip="Preencha aqui quantas horas pretende caçar por dia."
	// 					>
	// 						<TimePicker
	// 							changeOnBlur
	// 							inputReadOnly
	// 							onChange={value => onChange({ name: 'huntHours', value })}
	// 							placeholder=""
	// 							showNow={false}
	// 							format="HH:mm"
	// 							name="huntHours"
	// 						/>
	// 					</Form.Item>
	// 				</div>
	// 				<div>
	// 					<Form.Item label="Nível desejado" name="rawXpSoloPerHour">
	// 						<Input
	// 							name="currrentLevel"
	// 							addonBefore="Lv"
	// 							inputMode="numeric"
	// 						/>
	// 					</Form.Item>
	// 					<Form.Item label="Raw XP/h" name="rawXpSoloPerHour">
	// 						<Input
	// 							name="rawXpSoloPerHour"
	// 							addonAfter="kk"
	// 							inputMode="numeric"
	// 						/>
	// 					</Form.Item>
	// 					<Form.Item
	// 						label="Stamina atual do personagem"
	// 						name="currentStamine"
	// 					>
	// 						<TimePicker
	// 							changeOnBlur
	// 							inputReadOnly
	// 							onChange={value => onChange({ name: 'currentStamine', value })}
	// 							placeholder=""
	// 							showNow={false}
	// 							format="HH:mm"
	// 							name="currentStamine"
	// 						/>
	// 					</Form.Item>
	// 				</div>
	// 			</Space>
	// 			<Form.Item label="Boost" name="boostPerDay" wrapperCol={{ span: 24 }}>
	// 				<Radio.Group name="boostPerDay">
	// 					<Radio value="0">Sem boots</Radio>
	// 					<Radio value="1">1 (30 TC)</Radio>
	// 					<Radio value="2">2 (45 TC)</Radio>
	// 					<Radio value="3">3 (90 TC)</Radio>
	// 				</Radio.Group>
	// 			</Form.Item>
	// 			<Form.Item label="Evento?" name="bonusEvent" wrapperCol={{ span: 24 }}>
	// 				<Radio.Group name="bonusEvent">
	// 					<Radio value="1">Sem evento</Radio>
	// 					<Radio value="1.5">Bonus XP (50%)</Radio>
	// 					<Radio value="2">Double XP (100%)</Radio>
	// 				</Radio.Group>
	// 			</Form.Item>
	// 		</Form>
	// 		<Table dataSource={[result]} pagination={false}>
	// 			<Column dataIndex="solo" title="XP Solo" render={render}></Column>
	// 			<Column dataIndex="diff" title="Horas a mais"></Column>
	// 			<Column dataIndex="party" title="XP Party" render={render}></Column>
	// 		</Table>
	// 		<div
	// 			style={{
	// 				display: 'flex',
	// 				justifyContent: 'flex-end',
	// 				width: '100%',
	// 				marginTop: '1.5rem',
	// 			}}
	// 		>
	// 			<Button
	// 				type="primary"
	// 				onClick={() => {
	// 					antdForm.resetFields();
	// 					setForm({});
	// 				}}
	// 			>
	// 				Reset
	// 			</Button>
	// 		</div>
	// 	</>
	// );
}
