require('dotenv').config();
const mongoose = require ('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

const app = express();
const port = process.env.PORT || 4000;


const userData = {
  userId: "789789",
  password: "admin123",
  name: "NemaSys",
  username: "admin@nemasys.com",
  isAdmin: true
};


app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userdataDB?readPreference=primary&directConnection=true&ssl=false", {useNewUrlParser: true},
    console.log("conneced to DB!"));

    const userSchema = mongoose.Schema({
      name: String,
      mobile: String,
      email: String,
      address: String,
     
  })
  
  const uData = mongoose.model('uData', userSchema);


app.use(function (req, res, next) {
 
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; 
      next();
    }
  });
});



app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Hello - ' + req.user.name);
});

app.get('/getdata',(req,res)=>{
  const data=uData.find();
  if(data)
  res.json(data);
  else return{};
})


app.post('/add',async (req,res)=>{
  const data=req.body;
  console.log(data);
  const newData=new uData(data);
  try {
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.log(error);
  }
});

app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong."
    });
  }


  const token = utils.generateToken(userData);
  
  const userObj = utils.getCleanUser(userData);

  return res.json({ user: userObj, token });
});



app.get('/verifyToken', function (req, res) {
 
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });


    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
