const mime = require("mime-types");
const url = require("url");
const path = require("path");

const API = {}

API.getData = async function(body){
	const data = [
		{id: 1, code: 1, name: "test1"},
		{id: 2, code: 2, name: "test2"},
		{id: 3, code: 3, name: "test3"},
	];
	return {data: data};
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
	
	const result = await func(request.body);

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
