import React from 'react';
import { Link } from 'react-router-dom';
import {api} from './request';


function TableRows(props){
	const { data = [] } = props;
	return data.map( (row, i)=>{
		return (
			<tr key={i}>
				<td>{row.code}</td>
				<td>{row.name}</td>
			</tr>
		);
	});
}

class Importer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			file: "",
		};
	}
	onChange(evt){
		this.setState({file: evt.target.files});
	}
	async upload(){
		console.log(this.state.file);
		const {props, state} = this;
		if( !state.file )  return alert("CSVファイルを選択してください");
		
		const data = {
			table: props.table,
			file: state.file[0],
		}
		console.log("upload", data);
		
		const res = await api.request("import", data);
		//location.reload();
	}
	render(){
		return (
			<div className="importer">
				<input type="file" onChange={this.onChange.bind(this)} />
				<button onClick={this.upload.bind(this)}>インポート</button>
			</div>
		);
	}
}

function DataTable(props){
	const {table} = props;
	if(!table) return (<div></div>);
	
	const names = {
		"account": "勘定科目",
	}
	
	const name = names[table];
	
	return (
		<div>
			<div>{name}</div>
			<Importer {...props}/>
			<table>
				<thead>
					<tr>
						<th>コード</th>
						<th>名前</th>
					</tr>
				</thead>
				<tbody>
					<TableRows data={props.data}/>
				</tbody>
			</table>
		</div>
	);
}

export default class extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: [],
		};
	}

	async loadData(props){
		const match = props.match;
		//console.log("match", match);
		const { params = {} } = match;
		const { table } = params;
		if(!table) {
			this.setState({data: []});
		}
		const res = await api.request("getData", {
			table: table,
			columns: {_id: 0, code: 1, name: 2},
		});
		console.log("result", res.body);
		this.setState({data: res.body.data});
	}

	componentDidMount(){
		this.loadData(this.props);
	}

	componentWillReceiveProps(props){
		this.loadData(props);
	}
	
	render(){
		const match = this.props.match;
		console.log("match", match);
		const { params = {} } = match;
		
		return (
			<div className="master_import">
				<h1>マスタ管理</h1>
				
				<Link to="/import/account">勘定科目マスタ</Link>
				
				<DataTable table={params.table} data={this.state.data} />
			</div>
		);
	}
}
