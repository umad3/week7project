var mongoose = require('mongoose'); //Import the mongoose libraries
//reference to the schema
var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type:String
    },
    assign_To:{
        type:String,
        required: true,
        ref: 'Developer' // creates a relationship between the developer and task 
    },
    due_Date:{
        type:Date
    },
    status:{
        type:String,
        validate:{//This is a validator to ensure that tasks can only have a status of InProgress or Complete as written in the same was as the developer level (EXPERT or BEGINNER)
            validator:function(statusValue){
                return statusValue === 'InProgress' || statusValue === 'Complete' // for the vlidator to work, it shouldreturn true
            },
            message: 'Its either InProgress or Complete'
        }
    },
    description:{
        type:String
    },
    creadted:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model('Task', taskSchema);//The 'Task shows what this document should be referred to as when referencing this schema on other pages.'