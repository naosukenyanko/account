
const http = require('http');
const port = process.argv[2] || 8080;
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");


http.createServer(function(request, response) {
	var Response = {
        "200":function(file, filename){
            const extname = path.extname(filename);
			const basename = path.basename(filename);
			
            const header = {
                "Access-Control-Allow-Origin":"*",
				"Content-Type": mime.contentType(basename),
                "Pragma": "no-cache",
                "Cache-Control" : "no-cache"       
            }
			console.log(header);

            response.writeHead(200, header);
            response.write(file, "binary");
            response.end();
        },
        "404":function(){
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();

        },
        "500":function(err){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();

        }
    }


    var uri = url.parse(request.url).pathname;
	
    var filename = path.join(__dirname, "../htdocs", uri);
	if( uri.match(/images\/app\//)){
		filename = path.join(__dirname, "mock/icon", 
							 uri.replace(/images\/app\//, ''));
	}

	console.log("request", filename);

    fs.exists(filename, function(exists){
        console.log(filename+" "+exists);
        if (!exists) { Response["404"](); return ; }
        if (fs.statSync(filename).isDirectory()) { 
			filename += '/index.html'; 
		}

        fs.readFile(filename, "binary", function(err, file){
			if (err) { Response["500"](err); return ; }
            Response["200"](file, filename);   
        }); 

    });
}).listen(parseInt(port, 10), function(){
	console.log("listen on", port);
});
