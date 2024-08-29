const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require('../auth');
const { errorHandler } = require("../auth");

//register new User
module.exports.register = async(req, res) => {
  
    try{

        //initialize checkMailExist
        const checkMailExist = await User.find({email: req.body.email})

        // Checks if the email already exist
        for (let i = 0; i < checkMailExist.length; i++) {
            checkMailExist[i].email;
            if (checkMailExist[i].email === req.body.email) {
                return res.status(409).send({ message: 'Email already exist' });
            }
            break;
        }

        // Checks if the email is in the right format
        if(!req.body.email.includes('@')){
            return res.status(400).send({ message: 'Email invalid'})
        // Checks if the password has atleast 8 characters
        }else if(req.body.password.length < 8 ){
            return res.status(400).send({ messege: 'Password must be atleast 8 characters'})
        // If all needed requirements are achieved
        }else{

            // Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            })

            // Saves the created user to our database
            newUser.save()
            .then((result) => res.status(201).send({message: 'Registered Successfully' })) 
            .catch(err => errorHandler(err, req, res));
        }

    }catch(error){
        errorHandler(error, req, res);
    }
}

module.exports.login = (req, res) => {

    try{

        // Checks if the email is in the right format
        if(req.body.email.includes('@')){
            return User.findOne({email: req.body.email})
            .then(result => {
                // User does not exist/no result found in DB
                if(result === null){
                    return res.status(404).send({ message: 'No email found'});
                //If user exists
                }else {
                    //Bcrypt magic happens
                    const isPasswordCorrect = bcrypt.compareSync( req.body.password, result.password)

                    //password match
                    if(isPasswordCorrect){
                        // Generates an access token
                        return res.status(200).send({
                            access: auth.createAccessToken(result)
                        })

                    // Passwords do not match   
                    }else{
                        return res.status(401).send({ message: 'Email and password do not match' });
                    }
                }
            })
            .catch(err => errorHandler(err, req, res));

        }else {
            //email no "@"
            return res.status(400).send({ message: 'Invalid email' });
        }

    }catch(error){
        errorHandler(error, req, res)
    }
    
}

module.exports.getDetails = async (req, res) => {
   
    return await User.findById(req.user.id)
        .then(user => {

            if (!user) {
                // if no user is found, send a message 'User not found'.
                return res.status(404).send({ message: 'User not found' })

                // if the user is found, return the user.
            } else {
                
                return res.status(200).send({
                    user
                });
            }
        })
        .catch(err => errorHandler(err, req, res));
};