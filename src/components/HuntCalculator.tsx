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
import TimePicker from 'antd/es/time-picker';
import Collapse from 'antd/es/collapse';
import Radio from 'antd/es/radio';
import styled from 'styled-components';
import { HuntCalculator as HuntCalculatorLogic  } from '../logic/HuntCalculator';

const { Panel } = Collapse;

const CustomCollapse = styled(Collapse)`
	background-color: white;
	margin-bottom: 1rem;
	.ant-collapse-header {
		padding: 0 !important;
	}
`;

const CardResponsive = styled(Card)`
	box-sizing: border-box;
	margin: 0 auto;
	max-width: 600px;
	width: 95vw;
	border-radius: 0;

	@media (max-width: 720px) {
		margin: 0;
		width: 100%;
		max-width: unset;
		.ant-card-body {
			padding: 1rem;
		}
	}
`;

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

export function HuntCalculator() {
    const [form, setForm] = useState<any>({});
	const [calculator, setCalculator] = useState<HuntCalculatorLogic | null>(null);
	const [antdForm] = useForm();

	useEffect(() => {
		antdForm.setFieldsValue(form);
	}, [antdForm, form]);

	useEffect(() => {
		const calculator = new HuntCalculatorLogic(
			form.rawXpPartyPerHour?.replaceAll(',', '.'),
			form.rawXpSoloPerHour?.replaceAll(',', '.'),
		);
		setCalculator(calculator);
	}, [form.rawXpPartyPerHour, form.rawXpSoloPerHour]);

	function onChange({ name, value }: { name: string; value: any }) {
		const newForm = { ...form, [name]: value };
		setForm(newForm);
	}

	const result = useMemo(() => {
		const huntHours = toHours(form.huntHours);
		const bonusHours = toHours(form.bonusHours);

		const result = calculator?.calculate({
			hoursSolo: huntHours,
			hoursParty: huntHours,
			bonusHoursParty: bonusHours,
			bonusHoursSolo: bonusHours,
			bonusEvent: form.bonusEvent || 1,
		});

		return result || {};
	}, [calculator, form.bonusHours, form.huntHours, form.bonusEvent]);

	const explain = (
		<>
			<Typography.Title level={5}>Visão geral:</Typography.Title>
			<Typography.Paragraph>
				Normalmente sempre compensa caçar em time para obter o máximo de
				experiência, mas nem sempre é possível encontrar um time. Existem outros
				motivos que atrapalham a sua hunt como:{' '}
				<Typography.Text strong type="warning">
					atrasos, faltas e locais já ocupados por outros jogadores
				</Typography.Text>
				.
			</Typography.Paragraph>

			<Typography.Title level={5}>Solução:</Typography.Title>
			<Typography.Paragraph>
				Criei esta ferramenta para me ajudar (e a comunidade) a calcular{' '}
				<Typography.Text type="warning" strong>
					quanto tempo a mais devo caçar para compensar e obter os mesmos
					resultado
				</Typography.Text>
			</Typography.Paragraph>

			<Typography.Title level={5}>Novidades:</Typography.Title>
			<Typography.Paragraph>
				Em breve trarei mais funcionalidades que utilizo e análises para
				melhorar a eficiência do personagem
			</Typography.Paragraph>
		</>
	);
    
	return <CardResponsive bordered={false}>
		<CustomCollapse bordered={false}>
			<Panel header="O que é isso?" key="1">
				{explain}
			</Panel>
		</CustomCollapse>

		<Form
			onChange={(e: any) => onChange(e.nativeEvent.target)}
			style={{ maxWidth: 600 }}
			wrapperCol={{ span: 12 }}
			labelAlign="left"
			autoComplete="off"
			layout="vertical"
			form={antdForm}
		>
			<Space size="middle" direction="horizontal">
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
							inputMode="numeric" />
					</Form.Item>
					<Form.Item
						label="Horas de hunt?"
						name="huntHours"
						tooltip={<>
							Preencha aqui quantas horas pretende caçar por dia.<br />
							<br />{' '}
							<Typography.Text type="warning">
								Independente se for solo ou em party
							</Typography.Text>
						</>}
					>
						<TimePicker
							changeOnBlur
							inputReadOnly
							onChange={value => onChange({ name: 'huntHours', value })}
							placeholder=""
							showNow={false}
							format="HH:mm"
							name="huntHours" />
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
							inputMode="numeric" />
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

									if (!form.huntHours.isBefore(form.bonusHours)) {
										return;
									}

									throw new Error(
										'Não pode ser maior que a quantidade de horas de hunt'
									);
								},
							},
						]}
						tooltip={<>
							Preencha aqui quantas horas de stamina verde pretende caçar.
							<br /> <br />
							Ex: caso tenha{' '}
							<Typography.Text type="warning">
								42 horas de stamina
							</Typography.Text>
							, preencha com o valor{' '}
							<Typography.Text type="warning">3</Typography.Text>
						</>}
					>
						<TimePicker
							changeOnBlur
							inputReadOnly
							onChange={value => onChange({ name: 'bonusHours', value })}
							placeholder=""
							showNow={false}
							hideDisabledOptions
							disabledTime={time => ({
								disabledHours: () => [
									4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
									20, 21, 22, 23,
								],
							})}
							format="HH:mm" />
					</Form.Item>
				</div>
			</Space>

			<div style={{ width: '100%' }}>
				<Form.Item
					label="Evento?"
					name="bonusEvent"
					wrapperCol={{ span: 24 }}
				>
					<Radio.Group name="bonusEvent">
						<Radio value="1.5">Bonus XP (50%)</Radio>
						<Radio value="2">Double XP (100%)</Radio>
						<Radio value="1">Sem evento</Radio>
					</Radio.Group>
				</Form.Item>
			</div>
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
			<Button
				type="primary"
				onClick={() => {
					antdForm.resetFields();
					setForm({});
				} }
			>
				Reset
			</Button>
		</div>
	</CardResponsive>;
}