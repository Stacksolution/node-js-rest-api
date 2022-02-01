# Building a Restful CRUD API with Node.js, Express and MongoDB #
## We’ll be building a RESTful CRUD (Create, Retrieve, Update, Delete) API with Node.js, Express and MongoDB. ##
### We’ll use Mongoose for interacting with the MongoDB instance. ###

Express is one of the most popular web frameworks for node.js. It is built on top of node.js http module, and adds support for routing, middleware, view system etc. It is very simple and minimal, unlike other frameworks that try do way to much, thereby reducing the flexibility for developers to have their own design choices.  

Mongoose is an ODM (Object Document Mapping) tool for Node.js and MongoDB. It helps you convert the objects in your code to documents in the database and vice versa.  

## Prerequisites:  
Please install MongoDB in your machine if you have not done already. Checkout the official MogngoDB installation manual for any help with the installation.


### Our Application ###
In this tutorial, We will be building a simple Student application. We will build Rest APIs for creating, listing, editing and deleting a student.  

We’ll start by building a simple web server and then move on to configuring the database, building the student model and different routes for handling all the CRUD operations.  

Finally, we’ll test our REST APIs using Postman.  

We’ll heavily use ES6 features like let, const, arrow functions, promises etc. It’s good to familiarize yourself with these features. I recommend this re-introduction to Javascript to brush up these concepts.  

### Creating the Application
#### 1. Fire up your terminal and create a new folder for the application.

$ mkdir student-app  
#### 2. Initialize the application with a package.json file

Go to the root folder of your application and type npm init to initialize your app with a package.json file.

$ cd student-app  
$ npm init  

#### 3. Install dependencies  

We will need express, mongoose and body-parser modules in our application. Let’s install them by typing the following command -  

$ npm install express body-parser mongoose --save  

### Setting up the web server  
Let’s now create the main entry point of our application. Create a new file named index.js in the root folder of the application with the following contents -  
```
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Easy students application. Take student quickly. Organize and keep track of all your students."});
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
```
First, We import express and body-parser modules. Express, as you know, is a web framework that we’ll be using for building the REST APIs, and body-parser is a module that parses the request (of various content types) and creates a req.body object that we can access in our routes.  

Then, We create an express app, and add two body-parser middlewares using express’s app.use() method. A middleware is a function that has access to the request and response objects. It can execute any code, transform the request object, or return a response.  

Then, We define a simple GET route which returns a welcome message to the clients.  

Finally, We listen on port 3000 for incoming connections.  

All right! Let’s now run the server and go to http://localhost:3000 to access the route we just defined.  

$ node index.js     
Server is listening on port 3000  

### Configuring and Connecting to the database
I like to keep all the configurations for the app in a separate folder. Let’s create a new folder config in the root folder of our application for keeping all the configurations -  

$ mkdir config  
$ cd config  
Now, Create a new file database.config.js inside config folder with the following contents -  
```
module.exports = {
   url: 'mongodb://'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+ process.env.DB_NAME
}
```
We’ll now import the above database configuration in server.js and connect to the database using mongoose.  

Add the following code to the index.js file after app.use(bodyParser.json()) line -  

#### Configuring the database
```
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
```
Please run the server and make sure that you’re able to connect to the database -

$ node index.js   
Server is listening on port 3000  
Successfully connected to the database  

 #### Defining the Student model in Mongoose  
Next, We will define the student model. Create a new folder called app inside the root folder of the application, then create another folder called models inside the app folder -  

$ mkdir -p app/models  
$ cd app/models  
Now, create a file called Student.model.js inside app/models folder with the following contents -  

```
const mongoose = require('mongoose');

const Student = mongoose.Schema({
    name: String,
    age: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', Student);
```
The Student model is very simple. It contains a title and a content field. I have also added a timestamps option to the schema.  

Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.  

#### Defining Routes using Express  
Next up is the routes for the Student APIs. Create a new folder called routes inside the app folder.  

$ mkdir app/routes  
$ cd app/routes  
Now, create a new file called api.js inside app/routes folder with the following contents -  
```
const express = require('express');
const router = express.Router();
module.exports = router ;
//import 
const students = require('../controllers/student.controller.js');
// Create a new students
router.post('/students/create',students.create);
// Retrieve all students
router.get('/students',students.studentAll);
// Retrieve a single students with studenteId
router.post('/students/details',students.findOne);

```
student that We have added a require statement for student.controller.js file. We’ll define the controller file in the next section. The controller will contain methods for handling all the CRUD operations.  

Before defining the controller, let’s first include the routes in index.js. Add the following require statement before app.listen() line inside index.js file.  
```
// ........

// initialize routes
app.use('/api', require('./app/routes/api'));

// ........
```
If you run the server now, you’ll get the following error -  

$ node index.js  

#### Writing the Controller functions
Create a new folder called controllers inside the app folder, then create a new file called student.controller.js inside app/controllers folder with the following contents -  
```
const Student = require('../models/student.model.js');


// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            status:false,
            message: "Student Name can not be empty !"
        });
    }

    if(!req.body.age) {
        return res.status(400).send({
            status:false,
            message: "Student Age can not be empty !"
        });
    }

    // Create a Student
    const student = new Student({
        name: req.body.name || "Untitled Student", 
        age: req.body.age
    });

    // Save Student in the database
    student.save()
    .then(data => {
        res.status(200).send({
            status:true,
            message: data
        });
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: err.message || "Some error occurred while creating the Student."
        });
    });
};

// Retrieve and return all student from the database.
exports.studentAll = (req, res) => {
Student.find()
    .then(data => {
        res.status(200).send({
            status:true,
            message: data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving student."
        });
    });
};

// Find a single student with a studentId
exports.findOne = (req, res) => {

Student.findById(req.body.studentId)
    .then(student => {
        if(!student) {
            return res.status(404).send({
                status:false,
                message: "Student not found with id " + req.body.studentId
            });            
        }

        return res.status(200).send({
            status:true,
            message: "Student found with id " + req.body.studentId,
            data:student
        }); 

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                status:false,
                message: "Student not found with id " + req.body.studentId
            });                
        }
        return res.status(500).send({
            status:false,
            message: "Error retrieving student with id " + req.body.studentId
        });
    });
};

```

#### Let’s now look at the implementation of the above controller functions one by one -

##### Creating a new Student Records
```
// Create and Save a new Records
// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            status:false,
            message: "Student Name can not be empty !"
        });
    }

    if(!req.body.age) {
        return res.status(400).send({
            status:false,
            message: "Student Age can not be empty !"
        });
    }

    // Create a Student
    const student = new Student({
        name: req.body.name || "Untitled Student", 
        age: req.body.age
    });

    // Save Student in the database
    student.save()
    .then(data => {
        res.status(200).send({
            status:true,
            message: data
        });
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: err.message || "Some error occurred while creating the Student."
        });
    });
};
```
##### Retrieving all students
```
// Retrieve and return all student from the database.
exports.studentAll = (req, res) => {
Student.find()
    .then(data => {
        res.status(200).send({
            status:true,
            message: data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving student."
        });
    });
};
```
##### Retrieving a single student
```
// Find a single student with a studentId
exports.findOne = (req, res) => {

Student.findById(req.body.studentId)
    .then(student => {
        if(!student) {
            return res.status(404).send({
                status:false,
                message: "Student not found with id " + req.body.studentId
            });            
        }

        return res.status(200).send({
            status:true,
            message: "Student found with id " + req.body.studentId,
            data:student
        }); 

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                status:false,
                message: "Student not found with id " + req.body.studentId
            });                
        }
        return res.status(500).send({
            status:false,
            message: "Error retrieving student with id " + req.body.studentId
        });
    });
};
```
##### Updating a student
```
// Update a student identified by the studentID in the request
Comming soon
```
The {new: true} option in the findByIdAndUpdate() method is used to return the modified document to the then() function instead of the original.  

##### Deleting a student
```
// Delete a student with the specified studentID in the request
Comming soon
```

####
Creating a new student using POST http://localhost:3000/api/students/create
Node Express Rest API Create a student records  

Retrieving all students using GET http://localhost:3000/api/students
Node Express Rest API Retrieve All students  

Retrieving a single students using GET http://localhost:3000/api/students/details 
Node Express Rest API Retrieve a Single student  

<!-- Updating a Students using PUT /students/:studentId API  
Node Express Rest API Update a student  
Deleting a students using DELETE /students/:studentId API  
Node Express Rest API Delete a student records   -->
##### Conclusion
We learned how to build rest apis in node.js using express framework and mongodb.  
