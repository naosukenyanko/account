
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

async function test(){
	const client = await mongodb.connect(
		'mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db("account");
	console.log("connect");
	client.close();
}

test();
