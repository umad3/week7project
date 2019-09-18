var express = require('express');//Import the express libraries to make the app use express
var app = express(); //Making the app use express 
var bodyParser = require('body-parser');//Import the body parser libraries so you can use that middleware
var ObjectID = require('mongodb').ObjectId;//

app.engine('html', require('ejs').renderFile);//Setting the app engine to the ejs
app.set('view-engine', 'html');//Initializing the view engine for the application so it can render the html files
app.use(express.static('css'));//Allow the use of a css file for styling the html pages
app.use(express.static('images'));//Allow the use of images so they can be rendered such as the logo in the top left of your app
app.use(bodyParser.urlencoded({ //Parse the body of the url response and be able to encode the url so it can be recognized in the browser 
    extended: false //Don't use the extended view
}));

const mongoose = require('mongoose');//Import the mongoose libraries so we can connect the application to mongodb database
const Developer = require('./models/Developer');//Telling the application which mark ups to use when writing the developer and task data. The . before the path just shows that it's in a different folder than this server file
const Task = require('./models/Task');//Explained above
let url = 'mongodb://127.0.0.1:27017/fit2095db';//Setting the mongodb url to connect to. 127.0.0.1 is the same as saying localhost, and 27017 is the default mongodb port number to connect to/ In my case my db is called fit2095db so you can change it accordingly
mongoose.connect(url, { useNewUrlParser: true }/*This allows us to use the new version of the body parser because the last one has been deprecated*/, function (err, db) { })//Function to try and connect to mongodb using the mongoose middleware
 .then(() => { //This acts like a try in a try catch. You can see the catch below this method
     console.log("Database connected successfully");
    })
 .catch(err => { // mongoose connection error will be handled here
            console.error('Error connecting to database:', err.stack); //If it fails it will return this message and the error stack
            process.exit(1);// It will then exit the process 
 });


app.get('/', function (req, res) { //This is used render the index.html page if nothing follows the / in the url
    res.render('index.html', { username: 'Guest' }); //The username it will display is guest. This username value is passed to the index.html page when it is rendered
});

app.post('/newtask', function (req, res) {//The newtask router uses the app.post method because data is being written to the database
    Developer.findById(req.body.assignTo, function (err, docs) {//Search for a developer by their ID in the developer table
        let task1 = new Task({ //Creating a new task based on the Task model in the models folder
            _id: new mongoose.Types.ObjectId(), //The developer ID, which is an auto generated object ID type
            name: req.body.taskName, //The task name is pulled from the req url when the form is submitted
            assign_To: req.body.assignTo, //The task is assigned to the developer matching the ID above
            due_Date: req.body.due_Date, //The due date is pulled the same way as the task name 
            status: req.body.taskStatus, //Status is done the same way
            description: req.body.taskDesc //Same way
        }).populate('assign_To'); //This is the link between the task the developer because this task is now being assigned to the given ID so it then populates that developer's document
        task1.save(function (err) {//This then saves the task assuming there is no error in doing so
            if (err) throw err;
            console.log('Task Added');
        });
    });

    res.redirect('/listtask');//It then redirects you to the current list of tasks as it should
});

app.get('/listtask', function (req, res) { //This just directs you to the listtask.html page
    Task.find({}, function (err, docs) {
        res.render('listtask.html', { db: docs }); //The information about the docs(tasks) that are currently there is passed when the file is rendered
    });
});

app.get('/newtask', function (req, res) {//This is to route you to the newtask.html page
    res.render('newtask.html', {}); //Nothing is passed in this case as you can see
});

app.post('/deleteTask', function (req, res) {//Again this uses the post method because the data is being manipulated
    let id = req.body.taskID; //Declaring an id variable and assigning the ID that you will be looking for to delete that doc as the value
    Task.findByIdAndRemove(id, function (err, docs) { }); //Take the given ID and delete the task assuming no errors are found
    res.redirect('/listtask');//Redirect to the listtask.html page as it should
});
app.get('/deleteTask', function (req, res) {
    res.render('deleteTask.html', {});
});

app.get('/update', function (req, res) {
    res.render('update.html', {});
});


app.post('/update', function (req, res) {//A task is being updated so again the post method is required
    let id = req.body.taskID; //Get the task ID you want to update and assign it to the new variable id
    let status = req.body.taskStatus; //Get the status of the task matching that ID and assign it to this variable
    Task.updateOne({ '_id': id }, { $set: { 'status': status } }, function (err, docs) { }); //Update only the desired document in the database based on the ID
    res.redirect('/listtask');//Redirect to listtask.html as it should
});

app.get('/deleteAll', function (req, res) {
    res.render('deleteAll.html', {});
});

app.post('/deleteAll', function (req, res) {//Delete all the tasks currenty in the database
    Task.deleteMany({ 'status': 'Complete' }, function (err, docs) { });//Now we use the deleteMany because all the tasks are being deleted as long as they have a status saying Complete as shown in that condition
    res.redirect('/listtask');
});

app.get('/newDeveloper', function (req, res) {
    res.render('newDeveloper.html', {});
});


app.get('/listDeveloper', function (req, res) {
    Developer.find({}, function (err, db) {
        res.render('listDeveloper.html', { db: db });//This lists all the developers currently in the database. That data is pulled and passed when the file is rendered as seen in db:db
    });
});

app.post('/newDeveloper', function (req, res) {
    let developer1 = new Developer({ //Creating a new developer using the Developer model in a similar way as the tasks 
        _id: new mongoose.Types.ObjectId(),//Creating a new ID object which will be auto generated in the database
        name: { //In this case name has multiple layers but they are still encased in the general name column like a full name
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level, //Level is their skill level which must either be EXPERT or BEGINNER. Anything else will cause an error because we have not defined it as an acceptable value
        address: {//Addess is multi-layered just like the name above
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });
    developer1.save(function (err) {//Save the new developer document based on the defined schema in the mongodb database assuming there are no errors
        if (err) throw err;
    });
    res.redirect('/listDeveloper');
});

app.listen(8080);
console.log('Running');