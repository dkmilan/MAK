var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var personSchema = Schema({
  _id     : Number,
  name    : String,
  ideas : [{ type: Schema.Types.ObjectId, ref: 'idea' }]
});

var ideaSchema = Schema({
  _creator : { type: Number, ref: 'Person' },
  name    : String
});

var Idea  = mongoose.model('Idea', ideaSchema);
var Person = mongoose.model('Person', personSchema);
