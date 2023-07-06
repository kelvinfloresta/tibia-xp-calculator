import React from 'react'
import Typography from 'antd/es/typography';

export function HomePage(){
    return (
		<>
			<Typography.Title level={2}>Visão geral:</Typography.Title>
			<Typography.Paragraph>
				Normalmente sempre compensa caçar em time para obter o máximo de
				experiência, mas nem sempre é possível encontrar um time. Existem outros
				motivos que atrapalham a sua hunt como:{' '}
				<Typography.Text strong type="warning">
					atrasos, faltas e locais já ocupados por outros jogadores
				</Typography.Text>
				.
			</Typography.Paragraph>

			<Typography.Title level={2}>Solução:</Typography.Title>
			<Typography.Paragraph>
				Criei esta ferramenta para me ajudar (e a comunidade) a calcular{' '}
				<Typography.Text type="warning" strong>
					quanto tempo a mais devo caçar para compensar e obter os mesmos
					resultado
				</Typography.Text>
			</Typography.Paragraph>

			<Typography.Title level={2}>Novidades:</Typography.Title>
			<Typography.Paragraph>
				Em breve trarei mais funcionalidades que utilizo e análises para
				melhorar a eficiência do personagem
			</Typography.Paragraph>
		</>
	);
}