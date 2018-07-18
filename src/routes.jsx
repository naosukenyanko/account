import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import MainMenu from './menu';
import BalanceSheet from './balance_sheet';
import Input from './input';
import MasterImport from './import';
import JournalList from './list';

export default class extends React.Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		
	}
	
	render(){
		return (
			<Router>
				<div>
					<MainMenu/>
					
					<Switch>
						<Redirect exact from='/' to='/balance_sheet'/>
						<Route path='/balance_sheet' component={BalanceSheet}/>
						<Route path='/input' component={Input}/>
						<Route path='/list' component={JournalList}/>
						<Route path='/import/:table' component={MasterImport}/>
						<Route path='/import' component={MasterImport}/>
					</Switch>
				</div>
			</Router>
			
		)
	}
};
