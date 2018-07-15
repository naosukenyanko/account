
import superagent from 'superagent';

const host = location.host;

class Request{
	constructor(url){
		this.url = url;
	}

	request(cmd, args){
		return new Promise( (resolve, reject)=>{
			const url = [this.url, cmd].join("/");
			const body = Object.assign({}, args);
			
			console.log("send", url);
			
			const formData = new FormData();
			for(let name in body){
				formData.append(name, body[name]);
			}

			superagent
				.post(url)
				.send(formData)
				.set('accept', 'json')
				.end( (err, res)=>{
					if(err) return reject(err);
					resolve(res);
				});
		});
	}
}

const api = new Request("/api");

export {api, Request};
