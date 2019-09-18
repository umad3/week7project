var mongoose = require('mongoose');//Importing the mongoose libraries so we can connect to mongodb database
//reference to the schema
var developerSchema = mongoose.Schema({//This is the mongoose schema that will be used when storing new developers. In other words, the document will store data based on this structure
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName:{
            type:String,
            require:true //This means that the input is required and the form can't be submitted without it. False means it's not required
        },
        lastName:{
            type:String
        }
    },
    level:{
        type:String,
        validate:{//This is a validator which is used to check the input. As stated in the server page, the level can only be BEGINNER or EXPERT as written below. Anything else fails the validation and the form won't be submitted
            validator:function(statusValue){
                return statusValue === 'BEGINNER' || statusValue === 'EXPERT';
            },
            message:'Its either EXPERT or BEGINNER' //If it fails then this message will be shown to the user
        }
    },
    address:{
        state:String,
        suburb:String,
        street:String,
        unit:String
    },
    created:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model('Developer', developerSchema); //The 'Developer' shows what this will be referred to on other pages when referencing this schema