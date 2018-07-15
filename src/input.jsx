
import React from 'react';
import {api} from './request';

function TableHeader(props){
	return (
		<thead>
			<tr>
				<th></th>
				<th>日時</th>
				<th>借方項目</th>
				<th>借方金額</th>
				<th>貸方項目</th>
				<th>貸方金額</th>
				<th></th>
			</tr>
		</thead>
	);
}

function CodeSelector(props){
	const {data, account_codes = []} = props;
	const options = account_codes.map( (item, i)=>{
		return (
			<option key={i} value={item.code}>
				{item.name}
			</option>
		);
	});
	return (
		<select value={props.value}>
			<option value="">(選択)</option>
			{options}
		</select>
	);
}

function InputAmount(props){
	return (
		<input type="text" value={props.value} />
	);
}

function DateInput(props){
	return (
		<input type="text" value={props.value} />
	);
}

function TableRow(props){
	const {data, account_codes} = props;
	return (
		<tr>
			<td>{props.index+1}</td>
			<td><DateInput value={data.date}/></td>
			<td><CodeSelector {...props} value={data.debit_code} /></td>
			<td><InputAmount value={data.debit_amount} /></td>
			<td><CodeSelector {...props} value={data.credit_code} /></td>
			<td><InputAmount value={data.credit_amount} /></td>
			<td></td>
		</tr>
	);
}

function TableRows(props){
	const {data, account_codes} = props;
	return props.data.map( (row, i)=>{
		return (
			<TableRow key={i} {...props} data={row} index={i} />
		);
	});
}

export default class extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			data: [
				{
					date: "2018/10/12", 
					debit_code: "1",
					debit_amount: 100,
					credit_code: "1",
					credit_amount: 100,
				}
			],
			account_codes: []
		};
	}

	async loadAccountCodes(){
		const res = await api.request("getData", {table: "account"});
		this.setState({account_codes: res.body.data});
	}

	componentDidMount(){
		this.loadAccountCodes();
	}

	render(){
		
		return (
			<div>
				<h1>仕訳入力</h1>

				<table className="input_table">
					<TableHeader/>
					<tbody>
						<TableRows {...this.state}/>
					</tbody>
				</table>
				<div className="footer_buttons">
					<button>登録</button>
				</div>
			</div>
		);
	}
	
}
