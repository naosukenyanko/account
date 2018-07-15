
import React from 'react';

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
	return (
		<select>
		</select>
	);
}

function InputAmount(props){
	return (
		<input type="text"/>
	);
}

function DateInput(props){
	return (
		<input type="text"/>
	);
}

function TableRow(props){
	return (
		<tr>
			<td></td>
			<td><DateInput/></td>
			<td><CodeSelector/></td>
			<td><InputAmount/></td>
			<td><CodeSelector/></td>
			<td><InputAmount/></td>
			<td></td>
		</tr>
	);
}

function TableRows(props){
	return props.data.map( (row, i)=>{
		return (
			<TableRow key={i} data={row}/>
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
					debit_code: 0,
					debit_amount: 100,
					credit_code: 0,
					credit_amount: 100,
				}
			],
			account_codes: [
				{name: "", code: 1},
			]
		};
	}

	loadAccountCodes(){
		
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
						<TableRows data={this.state.data}/>
					</tbody>
				</table>
			</div>
		);
	}
	
}
