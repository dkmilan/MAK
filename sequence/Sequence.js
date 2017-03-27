const mongoose = require('mongoose');
module.exports = function() {
    const SequencSchema = mongoose.Schema({
        _id: {
            type: String,
            required: true
        },
        seq: {
            type: Number,
            default: 1
        }
    })
    mongoose.model('Sequence', SequencSchema);

    this.reset = (key) => {
        const SequencSchema = mongoose.model('Sequence');

        SequenceSchema.remove({ _id: key });
    }

    this.register = (EntitySchema, name, field) =>{
        const SequenceSchema = mongoose.model('Sequence');

        const key = name+'_'+field;

        console.log("setup id-auto for "+key);

        EntitySchema.pre('save', function (next) {
            var doc = this;
            if (doc[field] == null) {
                SequenceSchema.findByIdAndUpdate(
                    { _id: key },
                    { $inc: { seq: 1 } },
                    { upsert : true, new: true },
                    function(error, counter) {
                        if (error) return next(error);
                        doc[field] = counter.seq;
                        console.log(key+":"+counter.seq);
                        next();
                    }
                );
            }
            else {
                next();
            }
        });
    }
}
