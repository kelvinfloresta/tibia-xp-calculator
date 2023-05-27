import React from 'react';

import { HuntCalculator } from './components/HuntCalculator';
import { Background } from './components/Background';
import { Footer } from './components/Footer';

function App() {
	return (
		<Background>
			<HuntCalculator />
			<Footer />
		</Background>
	);
}

export default App;
