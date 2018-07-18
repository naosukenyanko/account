const mime = require("mime-types");
const url = require("url");
const path = require("path");
const mongodb = require('mongodb');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const iconv = require('iconv-lite');
const parse = require('csv-parse');
const fs = require('fs');
const parseFormdata = require('parse-formdata');

const API = {}

const TABLE_FILTER = {
	"account": "account",
	"journal": "journal",
};


async function getTableData(table, columns, where = {}){
	const MongoClient = mongodb.MongoClient;
	const client = await mongodb.connect(
		'mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db("account");
	const collection = db.collection(table);
	const data = await collection.find(where, columns).toArray();
	client.close();
	return data;
}

async function deleteData(table){
	const MongoClient = mongodb.MongoClient;
	const client = await mongodb.connect(
		'mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db("account");
	const collection = db.collection(table);
	const data = await collection.remove({});
	client.close();
	return data;
}

API.register = async function(body = {}){
	let { table, data } = body;
	data = JSON.parse( data );
	table = TABLE_FILTER[ table ];
	console.log("register", table, data);
	
	const MongoClient = mongodb.MongoClient;
	const client = await mongodb.connect(
		'mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db("account");
	const collection = db.collection(table);
	for(let row of data){
		if(row._id){
			await collection.update({_id: row.id}, row, true, false);
		}else{
			await collection.insert(row);
		}
	}

	client.close();
	return {
		status: "success",
	};
}

function parseJSON(val){
	if(!val) return val;
	return JSON.parse(val);
}

API.getData = async function(body = {}){
	let { table, columns, where } = body;
	table = TABLE_FILTER[ table ];
	columns = parseJSON(columns);
	where = parseJSON(where);
	data = await getTableData(
		table, columns, where);

	/*
	const data = [
		{id: 1, code: 1, name: "test1"},
		{id: 2, code: 2, name: "test2"},
		{id: 3, code: 3, name: "test3"},
	];
	*/
	return {data: data};
}

API.import = async function(body = {}){
	let { table, file } = body;
	table = TABLE_FILTER[ table ];

	if(!table) return new Error("need table") ;
	if(!file) return new Error("need file") ;
	
	console.log("import from", file.name);

	await deleteData(table);
	
	const outputDBConfig = { 
		dbURL : 'mongodb://localhost:27017/account',
		collection : table };
	
	const ws = await streamToMongoDB(outputDBConfig);

	
	const res = await new Promise( (resolve, reject)=>{
		const parser = parse({
			skip_empty_lines:true,
			columns: true,
		});
		
		const rs = file.stream;
		rs.pipe(iconv.decodeStream('SJIS'))
			.pipe(iconv.encodeStream('UTF-8'))
			.pipe(parser)
			.pipe(ws);
		
		let line = 0;
		parser.on('readable', ()=>{
			line++;
		});
		
		parser.on('end', ()=>{
			console.log("import close");
			
		});
		
		ws.on("close", ()=>{
			console.log("write end");
			resolve( {
				"result": "success", 
				"import": line,
			});
		});
		
	});
	
	
	return res;
}

async function getBody(req){
	const data = await new Promise( (resolve, reject)=>{
		parseFormdata(req, function (err, data) {
			if(err) return reject(err);
			resolve( data );
		});
	});
	
	const result = Object.assign({}, data.fields);
	
	for( let part of data.parts ){
		result[part.name] = {
			name: part.filename,
			stream: part.stream,
		};
	}
	return result;
}

module.exports = async function(request, response){
	var uri = url.parse(request.url).pathname;

	
	const cmd = uri.replace(/\/api\//, "");
	
	console.log("request", uri, cmd);
	
	const func = API[cmd];
	if( typeof(func) !== "function"){
		response.writeHead(400, {"Content-Type": "text/plain"});
        response.write("400 Bad Request\n");
        response.end();		
		return;
	}

	const body = await getBody(request);
	console.log("request body", body);
	try{
		const result = await func(body);
		//console.log("result", result);
		
		const header = {
			"Access-Control-Allow-Origin":"*",
			"Content-Type": mime.lookup('json'),
			"Pragma": "no-cache",
			"Cache-Control" : "no-cache"       
		}
		response.writeHead(200, header);
		response.write( JSON.stringify(result) );
		response.end();

	}catch(e){

		console.error(e);
		response.writeHead(400, {"Content-Type": "text/plain"});
        response.write("400 Bad Request\n");
        response.end();		
		
	}
		
}
