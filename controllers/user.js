const User = require('../models/User');

function isstringinvalid(str){
    if(str == undefined || str.length===0){
        return true;
    }  else {
        return false;
    }
}

exports.signUp = async (req, res, next) => {
    try {

     const name = req.body.name;
     const email = req.body.email;
     const password = req.body.password;
     const phonenumber = req.body.phonenumber;

     if(isstringinvalid(name) || isstringinvalid(email)  || isstringinvalid(password) || isstringinvalid(phonenumber)){
        return res.status(400).json( {err: "Bad Parameters, Something is missing"});
     }
      
   const data = await User.create( {name: name, email: email,password: password, phonenumber: phonenumber});
   res.status(201).json({message:'Successfully created new User'});
    }
    catch(error) {
        res.status(500).json({
            error: error
        });
    }
    
};

exports.login = async (req, res, next) => {
try {  
    const email = req.body.email;
    const password = req.body.password;
    if( isstringinvalid(email)  || isstringinvalid(password)){
        return res.status(400).json( {message: "Email or password is missing", success: false});
     }
    const user = await User.findAll({ where:{ email}});
    if(user.length>0){
         if(user[0].password === password){
            res.status(200).json({ success: true, message: "User logged in successfully"});
         } else {
           return res.status(400).json({ success: false, message: "Password is incorrect"});
         }
    }  else {
       return res.status(404).json({ success: false, message: "User doesn't exist"});
    }
  } catch(err) {
    res.status(500).json({ success: false, message: err});
  }
}