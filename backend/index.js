const express  = require('express');
const session = require('express-session');
const bodyParser = require ("body-parser")
const speakeasy= require("speakeasy")
const uuid=require('uuid');
const QRCode = require("qrcode")

const app=express()

const port = process.env.PORT || 3000

app.listen(port,()=>{
  console.log(`server running on port ${port}`)
})

// Mock database to store active sessions
let activeSessions = {};
let users={
  rahul:{
    password:"rahul@2021",
    secret:"my_secret_mfa"
  },
  aakash:{
    password:"sky@007",
    secret:"my_secret_mfa",
  }
}

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(session({
  secret: 'my_secret_mfa',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json())


app.post('/login', async(req, res) => {
  const userDetail =req.body;
  const url = 'https://apis.ccbp.in/login'
  const options = {method: 'POST', body: JSON.stringify(userDetail)}
  const fetchedData = await fetch(url, options)
  const data = await fetchedData.json()
  res.send(data)

});

// Generate MFA secret for a user
app.post('/generateMfaSecret', async (req, res) => {
  const { username } = req.body;
  try{
      const secret = speakeasy.generateSecret();
      users[username].secret = secret.base32;
      QRCode.toDataURL(secret.otpauth_url,(err, data_url)=>{
           res.send({"image":data_url});
      })
    }catch{
      return res.send({"error_msg":'Please Correctly Enter Username and Password', "status_code":403})
    }
  
  
});

// Verify MFA code
app.post("/verifyMfa", (req, res)=>{
  const{username,code}=req.body
  const user=users[username]
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token: code
  });
  if(verified){
    // Check if user already has an active session
    if (activeSessions[username]){
      res.send({"error_msg":'User already has an active session', "status_code":403});
    }else{
      // Create a new session
      const sessionId = uuid.v4();
      req.session.id = sessionId;
      activeSessions[username] = sessionId;
      res.send({"status":"MFa code is valid", "status_code":200})
    }
  }else{
    res.status(403).send({"error_msg":"Invalid MFA code"})
  }
});


app.post('/logout', (req, res) => {
  const { username } = req.body;
  // Remove the session from the active sessions
  delete activeSessions[username];
  console.log(username)
  res.send('Logged out successfully');
});




