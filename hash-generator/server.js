const PORT = 4444;
var   http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require("querystring"), // параметры get запроса
      crypto = require('crypto'); // hash
     
module.exports = (()=>{
   function inner(){
      this.start = whatToDo=>{
		  http.createServer((req, res)=>{
		  	
		  	var query  = url.parse(req.url).query, // запрос
    			params = qs.parse(query); // параметры, как объекты
		  	
			switch ( req.url.replace(/\/?(?:\?.*)$/, '').toLowerCase() ) {
				  
			  	case '/display' :

				  	if (params.hash == 'md5') {
				  		var hashSrc = crypto.createHash( 'md5' )
    						.update( params.src , 'utf8' )
    						.digest('hex');
				  	} else if(params.hash == 'sha1') {
				  		var hashSrc = crypto.createHash( 'sha1' )
    						.update( params.src , 'utf8' )
    						.digest('hex')
				  	} 

				  	if (params.type == 'json'){
				  		res.writeHead(200, {'Content-Type': 'application/json',
				  							'Access-Control-Allow-Origin': '*'
				  		});

				    	var json =	JSON.stringify({ 
										src:  params.src, 
										hash: params.hash,
										type: params.type,
										hashSrc: hashSrc
						  			}, null, '\t');
						  
				    	res.end(json);
				  		
				  	} else if (params.type == 'text'){
						
						res.writeHead(200, {'Content-Type': 'text/html',
											'Access-Control-Allow-Origin': '*'
						});

				    	res.end('src: ' + params.src + 
				    			'; hash: ' + params.hash + 
				    			'; type: ' + params.type + 
				    			'; hash src: ' + hashSrc);
						
				  	} else {
				  		
				  		res.writeHead(200, {'Content-Type': 'text/html', 
				  							'Access-Control-Allow-Origin': '*'
				  		});

						fs.readFile('public/index.html', (err, what)=>{
							if (err) throw err;
							res.end(what);
						});
				  	}

				  	break;
				  	
				default:
				       
				       res.writeHead(200, {	'Content-Type': 'text/html',
				       						'Access-Control-Allow-Origin': '*'
				       });

				       fs.readFile('public/index.html', (err, what)=>{
				          if (err) throw err;
				          	res.end(what);
				       });

				    break;
			 }
			
		  }).listen(process.env.PORT || PORT,()=>
		  	        console.log('--> Port %d listening!',PORT)
	         );
      };   
    }
  return new inner;
})();