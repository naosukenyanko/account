import React from 'react';
import { Link } from 'react-router-dom';

function LinkButton(props){
	return (
		<Link {...props}>
			<div className="link_button">
				{props.children}
			</div>
		</Link>
		
	);
}

export default class extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="main_menu">
				<LinkButton to="/balance_sheet">賃借対照表</LinkButton>
				<LinkButton to="/input">仕訳入力</LinkButton>
				<LinkButton to="/list">仕訳一覧</LinkButton>
				<LinkButton to="/import">マスタ管理</LinkButton>
			</div>
		);
	}
}
