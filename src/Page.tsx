import React, { PropsWithChildren } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Footer } from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';

const { Content, Sider } = Layout;

const Page: React.FC<PropsWithChildren> = ({ children }) => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const navigate = useNavigate();

	const items: MenuProps['items'] = [
		{
			key: '1',
			link: '/',
			label: 'Home',
		},
		{
			key: '2',
			link: '/hunt-calculator',
			label: 'Solo Vs Party',
		},
		{
			key: '3',
			link: '/rush-calculator',
			label: 'Calculador de nível',
		},
	].map(el => ({
		key: el.key,
		label: el.label,
		onClick: () => navigate(el.link),
	}));

	return (
		<Layout hasSider>
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
				style={{ height: '100vh', overflow: 'hidden' }}
			>
				<Logo />
				<Menu theme="dark" mode="inline" items={items} />
			</Sider>
			<Layout>
				<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
					<div
						style={{
							padding: 24,
							background: colorBgContainer,
						}}
					>
						{children}
					</div>
				</Content>
				<Footer />
			</Layout>
		</Layout>
	);
};

export default Page;
