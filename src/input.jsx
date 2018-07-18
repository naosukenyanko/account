
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

function CodeSelector(props){
	const {data, account_codes = []} = props;
	const onChange = (evt)=>{
		props.onChange(evt.target.value);
	}
	const options = account_codes.map( (item, i)=>{
		return (
			<option key={i} value={item.code}>
				{item.name}
			</option>
		);
	});
	return (
		<select value={props.value} onChange={onChange}>
			<option value="">(選択)</option>
			{options}
		</select>
	);
}

function InputAmount(props){
	const onChange = (evt)=>{
		props.onChange(evt.target.value);
	}
	return (
		<input type="text" value={props.value} onChange={onChange} />
	);
}

function DateInput(props){
	const onChange = function(evt){
		props.onChange(evt.target.value);
	}
	return (
		<input type="text" value={props.value} onChange={onChange} />
	);
}

function copy(obj){
	return JSON.parse( JSON.stringify(obj) );
}

function SetInput(props){
	const {data, account_codes} = props;

	const rows = data.map( (row, i)=>{
		const onChange = function(name){
			return function(val){
				const newData = copy(data[i]);
				newData[name] = val;
				data[i] = newData;
				props.onChange(data);
			}
		}
		const addRow = function(){
			const newData = copy(data);
			const newRow = {
				code: "",
				amount: "",
			}
			newData.splice(i+1, 0, newRow);
			props.onChange(newData);
		}
		const removeRow = function(){
			if(data.length < 2){
				return;
			}
			const newData = copy(data);
			newData.splice(i, 1);
			props.onChange(newData);
		}
		
		const key = [data.length, i].join("_");

		return (
			<div key={key}>
				<CodeSelector {...props} value={row.code}
				onChange={onChange("code")} />			
				<InputAmount value={row.amount}
				onChange={onChange("amount")} />
				<button className="manage_button"
					onClick={addRow}>+</button>
				<button className="manage_button"
					onClick={removeRow}>-</button>
			</div>
		);
	});
	return rows;
}

function TableRow(props){
	const {data, account_codes} = props;
	const onAdd = function(){
		props.addRow(props.index+1);
	};
	const onRemove = function(){
		props.removeRow(props.index);
	}
	const onChange = function(name){
		return function(value){
			const newData = Object.assign({}, data);
			newData[name] = value;
			props.onChange(props.index, newData);
		}
	}

	return (
		<tr>
			<td>{props.index+1}</td>
			<td>
				<DateInput value={data.date} 
						   onChange={onChange("date")} />
			</td>
			<td className="set">
				<SetInput {...props} data={data.debit}
				onChange={onChange("debit")} />
			</td>
			<td className="set">
				<SetInput {...props} data={data.credit}
				onChange={onChange("credit")} />
			</td>
			
			<td>
				<button className="manage_button" 
					onClick={onAdd}>+</button>
				<button className="manage_button"
					onClick={onRemove}>-</button>
			</td>
		</tr>
	);
}

function TableRows(props){
	const {data, account_codes} = props;
	return props.data.map( (row, i)=>{
		const key = [data.length, i].join("_");
		return (
			<TableRow key={key} {...props} data={row} index={i} />
		);
	});
}

function getToday(){
	const d = new Date();
	const ss = function(val){
		return ("00" + val).slice(-2);
	}
	return [
		d.getFullYear(),
		ss( d.getMonth()+1 ),
		ss( d.getDate() ),
	].join("/")
}

export default class extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			mode: "add",
			data: [
				{
					date: getToday(),
					debit: [
						{code: "", amount: ""},
					],
					credit: [
						{code: "", amount: ""},
					],
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

	addRow(index){
		const {data} = this.state;
		const row = {
			date: getToday(),
			debit: [
				{code: "", amount: ""},
			],
			credit: [
				{code: "", amount: ""},
			]
		};
		data.splice(index, 0, row);
		
		this.setState({data: copy(data)});
	}

	removeRow(index){
		const {data} = this.state;
		if(data.length < 2){
			return;
		}
		data.splice(index, 1);		
		this.setState({data: copy(data)});
	}

	onChange(index, val){
		const {data} = this.state;
		data[index] = val;
		console.log("change", data);
		this.setState({data: copy(data) });
	}
	
	async register(){
		const {data} = this.state;
		
		data.forEach( (row, i)=>{
			row.sequence = i+1;
		});
		
		const msg = checkData(data);
		if(msg) return alert(msg);
		
		const result = await api.request("register", {
			table: "journal",
			data: JSON.stringify(data),
		});
		alert("登録しました");
		
	}

	onChangeMode(evt){
		const mode = evt.target.value;
		let data = [{
			date: getToday(),
			debit: [
				{code: "", amount: ""},
			],
			credit: [
				{code: "", amount: ""},
			],
		}]; 
		if( mode === "edit" ) data = [];
		this.setState({mode: mode, data: data});
	}

	render(){
		
		const display = this.state.mode === "add" ? "none": "block";
		
		return (
			<div className="input_screen">
				<h1>仕訳入力</h1>

				<div className="group">
					<select value={this.state.mode} 
						onChange={this.onChangeMode.bind(this)}>
						<option value="add">新規入力</option>
						<option value="edit">編集</option>
					</select>
				</div>
				<div className="group" style={{display: display}}>
					期間指定<input type="text"/>〜
					<input type="text"/>
					<button>読み込み</button>
				</div>

				<table className="input_table">
					<TableHeader/>
					<tbody>
						<TableRows {...this.state} 
								   addRow={ this.addRow.bind(this) }
						removeRow={ this.removeRow.bind(this) }
						onChange={ this.onChange.bind(this) } />
					</tbody>
				</table>
				<div className="footer_buttons">
					<button onClick={this.register.bind(this)}>登録</button>
				</div>
			</div>
		);
	}
	
}


function checkData(data){
	const checkRow = function(data){
		
		const checkNum = function(data){
			for(let row of data){
				if(row.amount === "")
					return "値を入力してください";
				const val = parseFloat(row.amount);
				if( isNaN(val) ){
					return "数値を入力してください";
				}
			}
			return "";
		}
		const sum = function(data){
			let result = 0;
			for(let row of data){
				result += parseFloat(row.amount);
			}
			return result;
		};
		
		const num1 = checkNum(data.debit);
		const num2 = checkNum(data.credit);
		if(num1) return num1;
		if(num2) return num2;
		const debit = sum(data.debit);
		const credit = sum(data.credit);
		if( debit !== credit ){
			return data.sequence + "行目 借方と貸方の値が違います";
		}

		return "";
		
	}


	for(let row of data){
		const msg = checkRow(row);
		if(msg) return msg;
	}

	return "";
}
