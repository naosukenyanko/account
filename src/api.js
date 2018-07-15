const mime = require("mime-types");
const url = require("url");
const path = require("path");
const mongodb = require('mongodb');

const API = {}

async function getTableData(table){
	const MongoClient = mongodb.MongoClient;

	const client = await mongodb.connect(
		'mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db("account");
	const collection = db.collection(table);
	const data = await collection.find().toArray();
	client.close();
	return data;
}

API.getData = async function(body = {}){
	const { table } = body;
	data = await getTableData(table);

	/*
	const data = [
		{id: 1, code: 1, name: "test1"},
		{id: 2, code: 2, name: "test2"},
		{id: 3, code: 3, name: "test3"},
	];
	*/
	return {data: data};
}

function getBody(req){
	return new Promise( (resolve, reject)=>{
		let body = '';
		let err;
		req.on('data', function (dat) {
			body += dat;
		});
		req.on('end',function(){
			if(err) return reject(err);
			resolve( JSON.parse(body) );
		});
		req.on('error', function(data){
			err = data;
		});
	});
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

	//console.log("request", request);
	const result = await func(body);
	

	const header = {
        "Access-Control-Allow-Origin":"*",
		"Content-Type": mime.lookup('json'),
        "Pragma": "no-cache",
        "Cache-Control" : "no-cache"       
    }
	response.writeHead(200, header);
    response.write(JSON.stringify(result), "text/plain");
    response.end();
	
}
