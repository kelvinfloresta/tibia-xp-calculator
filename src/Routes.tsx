import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SoloVsParty } from './components/SoloVsParty';
import { RushCalculator } from './components/RushCalculator';
import Page from './Page';
import { HomePage } from './pages/Home';

export const router = createBrowserRouter([
	{
		index: true,
		path: '/',
		element: (
			<Page>
				<HomePage />
			</Page>
		),
	},
	{
		path: '/hunt-calculator',
		element: (
			<Page>
				<SoloVsParty />
			</Page>
		),
	},
	{
		path: '/rush-calculator',
		element: (
			<Page>
				<RushCalculator />
			</Page>
		),
	},
]);

export const Routes = <RouterProvider router={router} />;
