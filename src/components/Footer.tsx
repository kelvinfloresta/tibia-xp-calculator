import Card from 'antd/es/card/Card';
import { styled } from 'styled-components';

const StyledFooter = styled(Card)`
	width: fit-content;
	margin: 0 auto;
	margin-top: 1rem;

	.ant-card-body {
		display: flex;
		flex-wrap: wrap;

		a {
			text-align: center;
			vertical-align: bottom;
			width: 64px;
			height: 64px;
			display: inline-block;

			&:not(:last-child) {
				margin-right: 1.5rem;
			}
		}

		a.only-text {
			margin-top: 0.5rem;
		}
	}
`;

export function Footer() {
	return (
		<StyledFooter>
			<a
				href="https://www.twitch.tv/andergaelbriel"
				title="Twitch do Gaelbriel"
				target="_blank"
				rel="noreferrer"
			>
				<img src="/twitch.svg" alt="Twitch do Gaelbriel" />
			</a>

			<a
				href="https://wa.me/+5521983162465"
				target="_blank"
				rel="noreferrer"
				className="only-text"
			>
				Anuncie aqui
			</a>

			<a
				href="https://www.twitch.tv/dioldtimes"
				title="Twitch do DiOldTimes"
				target="_blank"
				rel="noreferrer"
			>
				<img
					src="/golden-doll.gif"
					alt="DiOldTimes"
					width={54}
					style={{ marginTop: 3 }}
				/>
			</a>
		</StyledFooter>
	);
}
