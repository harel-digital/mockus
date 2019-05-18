import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';

import './app.css';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" component={HomePage}/>
			</Switch>
		</Router>
	);
}

export default App;
