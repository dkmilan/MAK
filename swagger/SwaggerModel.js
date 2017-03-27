const mongoose = require('mongoose'),
    YAML = require('yamljs');

var getDbType = function(swagger) {
    var dbType = {
        number: 'Number',
        integer: 'Number',
        string: 'String',
        'date-time': 'String',
        boolean: 'Boolean'
    }

    for (var modelName in swagger.definitions) {
        var model = swagger.definitions[modelName];
        var type = 'ObjectId';
        if (model.properties._id) {
            var _idType = model.properties._id.type;
            type = dbType[_idType];
        }
        dbType[modelName] = {
            type: type,
            ref: modelName
        };
    }
    return dbType;
}

module.exports = function(yamlPath) {
    const swagger = YAML.load(yamlPath);
    var dbType = getDbType(swagger);
    this.swaggerModel = {};
    for (var modelName in swagger.definitions) {
        console.log(modelName);
        var model = swagger.definitions[modelName];
        var dbModel = {};
        var properties = model.properties;
        for (var propName in properties) {
            var prop = properties[propName];

            var type = prop.type;
            if (type === 'array') {
                var itemType = prop.items.type ? prop.items.type : prop.items.$ref.substr(14)
                if (prop.items.$ref && prop.items.embeded) {
                    dbModel[propName] = [itemType];
                }
                else {
                    dbModel[propName] = [dbType[itemType]];
                }
            } else {

                if (!type) {
                    type = prop.$ref.substr(14);
                }
                if (prop.$ref && prop.embeded) {
                    dbModel[propName] = type;
                }else{
                    dbModel[propName] = dbType[type];
                }
            }

            console.log('-' + propName + ':' + type);
        }
        console.log(dbModel);
        this.swaggerModel[modelName] = mongoose.Schema(dbModel);
    }
    this.getModels = function() {
        return this.swaggerModel;
    }
    this.registerAll = function() {
        for (var modelName in this.swaggerModel) {
            mongoose.model(modelName, this.swaggerModel[modelName]);
        }
    }
}
