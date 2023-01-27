var express = require("express")
var app = express()
var cors = require("cors")
let projectCollection; 

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
//const bcrypt = require('bcrypt');
//mongoDb connection...
const MongoClient = require('mongodb').MongoClient;
let http = require('http').createServer(app);
let io = require('socket.io')(http);

//add database connections...
const uri = 'mongodb+srv://Eiraj:password1234@cluster0.bu3yarb.mongodb.net/?retryWrites=true&w=majority' 
const client = new MongoClient(uri, {useNewUrlParser: true})

// insert project...

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

const createColllection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}



app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })
})

// post sign up api....
app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertRegister(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})
const insertRegister = (project,callback) => {
    projectCollection.insert(project,callback);
}

app.post('/api/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});
//login


var port = process.env.port || 3000;
app.listen(port,()=>{
    console.log("App listening to http://localhost:"+port)
    createColllection("Football")
})

//socket test
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    setInterval(()=>{
      socket.emit('number', parseInt(Math.random()*10));
    }, 1000);
  
  });
  