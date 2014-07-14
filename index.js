var internals = {}

internals.install = function(sequelize, Sequelize, next){
  var models = {}

  var Country = 
  models.Country = sequelize.define('Country', {
    country: {
      type : Sequelize.STRING,
      notEmpty: true,
      notNull: true,
      unique: true
    }
  })

  var Definition = 
  models.Definition = sequelize.define('Definition', {
    definition: {
      type: Sequelize.TEXT,
      notNull: true,
      notEmpty: true,
      unique: true
    },
    uid: {
      type : Sequelize.STRING,
      unique: true,
      validate: {
        notNull: true,
        isUUID: 4
      }
    }
  })

  var Example = 
  models.Example = sequelize.define('Example', {
    example: {
      type: Sequelize.TEXT,
      notNull: true,
      notEmpty: true,
      unique: false
    }
  })

  var Hyperlink = 
  models.Hyperlink = sequelize.define('Hyperlink', {
    hyperlink: {
      type: Sequelize.STRING,
      isUrl: true,
      notNull: true,
      notEmpty: true,
      unique: true
    }
  })

  var Word = 
  models.Word = sequelize.define('Word', {
    lema: {
      type: Sequelize.STRING,
      notNull: true,
      notEmpty: true,
      unique: 'lema-pos-index'
    },
    pos: {
      type: Sequelize.STRING,
      notNull: true,
      notEmpty: true,
      unique: 'lema-pos-index'
    },
    gerund: {
      type: Sequelize.STRING,
      notNull: false,
      notEmpty: true,
      // unique: 'lema-pos-index'
    },
    participle: {
      type: Sequelize.STRING,
      notNull: false,
      notEmpty: true,
      // unique: 'lema-pos-index'
    },
    register: {
      type: Sequelize.BOOLEAN,
      notNull: true,
      defaultValue: true,
      notEmpty: true,
    }
  })

  var Language = 
  models.Language = sequelize.define('Language', {
    language: {
      type: Sequelize.STRING,
      isAlpha: true,
      notNull: true,
      notEmpty: true,
      unique: true
    }
  })

  var WordCountry = 
  models.WordCountry = sequelize.define('WordCountry', {
     frequency: {
      type: Sequelize.INTEGER.UNSIGNED,
      notNull: true,
      defaultValue: 0,
      notEmpty: true,
      min: 0,
      max: 100
    }
  })




  Word.hasMany(Country, { through: WordCountry })
  Country.hasMany(Word, { through: WordCountry })

  Word.hasMany(Word, { as : 'Synonyms', joinTableName: 'Synonyms'})
  Word.hasMany(Word, { as : 'Antonyms', joinTableName: 'Antonyms'})
  Word.hasMany(Word, { as : 'Relatives', joinTableName: 'Relatives'})
  Word.hasMany(Word, { as : 'Compounds', joinTableName: 'Compounds'})

  Language.hasMany(Word)
  Word.belongsTo(Language)
  
  Word.hasMany(Hyperlink)

  Word.hasMany(Definition)
  Definition.hasMany(Example)


  sequelize
  .sync()
  .complete(function(err) {
    if (!!err) {
      next(err)
    }


    Language.bulkCreate([
      { language: "Spanish" },
      { language: "English" }
    ])
    .error(function(err){
      next(err)
    })
    .success(function(){
      Country.bulkCreate([
        { country: "Spain" },
        { country: "Mexico" },
        { country: "Costa Rica" },
        { country: "Peru" },
        { country: "Colombia" },
        { country: "Ecuador" },
        { country: "Guatemala" },
        { country: "Cuba" },
        { country: "Honduras" },
        { country: "Panama" },
        { country: "Equatorial Guinea" },
        { country: "Puerto Rico" },
        { country: "Paraguay" },
        { country: "Argentina" },
        { country: "Chile" },
        { country: "Nicaragua" },
        { country: "Urugay" },
        { country: "Dominican Republic" },
        { country: "Bolivia" }

      ])
      .error(function(err){
        if (!!err) {
          next(err)
        }
      })
    })
  })

  return next(null, models)
}

internals.sync = function(sequelize, next){
  sequelize
  .sync()
  .complete(function(err) {
    if (!!err) {
      next(err)
    }
    next()
  })
}


exports.register = function (plugin, options, next) {
  var sequelize_plugin = plugin.servers[0].plugins['hapi-sequelize']

  if(!sequelize_plugin){
    plugin.log(['dictionary-rdbms', 'fatal'],'hapi-sequelize plugin required')
    process.exit(1)
  }

  if(sequelize_plugin.sequelize && sequelize_plugin.Sequelize){
    var sequelize = sequelize_plugin.sequelize
        Sequelize = sequelize_plugin.Sequelize


    if(options.drop){
      internals.install(sequelize, Sequelize, function(err, models){
        if(err){
          plugin.log(['dictionary-rdbms', 'err'], err)
        }

        plugin.expose('db', sequelize)
        plugin.expose('models', models)
        
       
      })      
    }
  }


  return next()
  
}

exports.register.attributes = {
  name: 'dictionary-rdbms',
  pkg: require('./package.json')
};

