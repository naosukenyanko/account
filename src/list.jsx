
import React from 'react';
import {api} from './request';

function TableHeader(props){
	return (
		<thead>
			<tr>
				<th></th>
				<th>日時</th>
				<th className="set">借方</th>
				<th className="set">貸方</th>
				<th></th>
			</tr>
		</thead>
	);
}

function DataSet(props){
	const {data, account} = props;
	
	return data.map( (row, i)=>{
		return (
			<div key={i}>
				{ account[ row.code ] }
				{ row.amount }
			</div>			
		);
	});
}

function TableRow(props){
	const {data} = props;
	return (
		<tr>
			<td>{props.index}</td>
			<td>{data.date}</td>
			<td><DataSet {...props} data={data.debit}/> </td>
			<td><DataSet {...props} data={data.credit}/> </td>
			<td></td>
		</tr>
	);
}

function TableRows(props){
	const data = props.data.map( (row, i)=>{
		return (
			<TableRow {...props} data={row} key={i} index={i+1} />
		);
	});
	return (<tbody>{data}</tbody>);
}


export default class extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			search: {
				begin: "",
				end: "",
			},
			data: [],
			account: [],
		};
	}

	componentDidMount(){
		this.loadAccountData();
	}

	onChangeBegin(evt){
		const search = this.state.search;
		search.begin = evt.target.value;
		this.setState({ search: search });
	}

	onChangeEnd(evt){
		const search = this.state.search;
		search.end = evt.target.value;
		this.setState({ search: search });
	}

	async loadAccountData(){
		const result = await api.request("getData", {
			table: "account",
		});
		const data = result.body.data;
		console.log("accont", data);
		let hash = {};
		for(let row of data){
			hash[row.code] = row.name;
		}
		this.setState({account: hash});
	}

	async loadData(){
		const search = this.state.search;
		const result = await api.request("getData", {
			table: "journal",
			where: {date: {$gte: search.begin, $lte: search.end}},
		});
		const data = result.body.data;
		console.log("result", data);
		this.setState({ data: data });
	}

	render(){
		const {search} = this.state;
		return (
			<div className="journal_list">
				<div className="group">
					期間指定<input type="text" value={search.begin}
					onChange={this.onChangeBegin.bind(this)} />〜
					<input type="text" value={search.end}
					onChange={this.onChangeEnd.bind(this)} />
					<button onClick={this.loadData.bind(this)}>読み込み</button>
				</div>
				<table>
					<TableHeader/>
					<TableRows data={this.state.data}
					account={this.state.account} />
				</table>
			</div>
		);
	}
}
