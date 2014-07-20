var Lab = require("lab"),
		Server = require("./test_srv"),
    http = require('http')

Lab.experiment("dictionary-rdbms", function() {
  var options = {}, 
      server,
      delay = 0

  Lab.before(function (done) {
    server = new Server.getServer()

    
    // Wait 1 second
    setTimeout(function () { done() }, 1000)
  })

  Lab.beforeEach(function (done) {
    options = {}
    done()
  })

 

  Lab.test("Exposed variables & Models", function (done) {
    
    var testHandler = function(req, rep){
      var db_plugin = req.server.plugins['dictionary-rdbms']
      
      var assert = require('assert')
      assert(db_plugin, 'db_plugin missing')
      assert(db_plugin.db, 'db_plugin.db missing')
      assert(db_plugin.models, 'db_plugin.models missing')


      assert(db_plugin.models.Word, 'db_plugin.models.Word missing')
      assert(db_plugin.models.Country, 'db_plugin.models.Country missing')
      assert(db_plugin.models.Definition, 'db_plugin.models.Definition missing')
      assert(db_plugin.models.Example, 'db_plugin.models.Example missing')
      assert(db_plugin.models.Hyperlink, 'db_plugin.models.Hyperlink missing')
      assert(db_plugin.models.Language, 'db_plugin.models.Language missing')
      assert(db_plugin.models.WordCountry, 'db_plugin.models.WordCountry missing')
      
      rep({result : true})
    },
    routes = { method : 'GET', path: '/', handler: testHandler}, 
    server = new Server.getServer(routes)

    options = { method: 'GET', url: '/'}

    server.inject(options, function(response) {
      
      Lab.expect(response.statusCode).to.equal(200)

      setTimeout(done, delay)
    
    })
	})

})

