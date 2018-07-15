import React from 'react';
import { Link } from 'react-router-dom';
import {api} from './request';


function TableRows(props){
	const { data = [] } = props;
	return data.map( (row, i)=>{
		return (
			<tr key={i}>
				<td>{row.id}</td>
				<td>{row.name}</td>
			</tr>
		);
	});
}

function DataTable(props){
	const {table} = props;
	if(!table) return (<div></div>);
	
	return (
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>名前</th>
				</tr>
			</thead>
			<tbody>
				<TableRows data={props.data}/>
			</tbody>
		</table>
	);
}

export default class extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: [],
		};
	}

	async loadData(){
		const match = this.props.match;
		console.log("match", match);
		const { params = {} } = match;
		const { table } = params;
		if(!table) {
			this.setState({data: []});
		}
		api.request("getData", {table: table});
	}

	componentDidMount(){
		this.loadData();
	}
	
	render(){
		const match = this.props.match;
		console.log("match", match);
		const { params = {} } = match;
		
		return (
			<div>
				<h1>マスタ管理</h1>
				
				<Link to="/import/account">勘定科目マスタ</Link>
				
				<DataTable table={params.table} data={this.state.data} />
			</div>
		);
	}
}
