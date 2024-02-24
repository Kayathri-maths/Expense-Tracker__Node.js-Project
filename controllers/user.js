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