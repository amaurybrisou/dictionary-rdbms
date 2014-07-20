var Hapi = require('hapi'),
		server,
		options

module.exports = (function(){
	if(server){
		return {
			options : options,
		  server: server 
		}
	}

	options = [
			{
				plugin: require('../../hapi-sequelize'),
				options : {
	    		dialect: 'sqlite',
	    		storage:  __dirname + '/test.sqlite',
	    		logging: false,//console.log
	    	}
			},
	    {
	    	plugin: require('../'),
	    	options : {
					drop: true,
					sync: {force: true }
				}
			}
		]
		

	
	function getServer(routes, start){

		if(server){
			server.stop()
		}

		server = new Hapi.Server(
			'localhost', 
			34567,
		 { debug: { request : [ 'error', 'log'] } });

		if(routes) server.route(routes)

		server.pack.register(options, {}, function (err) {
		  if (err) {
		    console.log('Failed loading plugin');
		  }
		});

		if(start){
			server.start(function(err){
				if(err){
					console.log('Error ', err)
					process.exit(1)
				}
			})
		}
		return server
	}

	return {
		options : options,
	  getServer: getServer 
	}
		
}())