const bcrypt = require('bcrypt');
const User = require("../models/User");
const { errorHandler, createAccessToken } = require('../auth.js');


// [SECTION] User Registration
module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, mobileNo, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User with this email already exists' });
        }

        if (typeof name !== 'string') {
            return res.status(400).send({ message: 'Name must be a string' });
        } else if (!email.includes('@')) {
            return res.status(400).send({ message: 'Invalid email format' });
        } else if (password.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long' });
        } else {
            let newUser = new User({
                name,
                email,
                mobileNo,
                password: bcrypt.hashSync(password, 10)
            });

            const user = await newUser.save();
            return res.status(201).send({ message: "Registered Successfully", user });
        }
    } catch (error) {
        console.error("Error in registration: ", error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] User Login
module.exports.loginUser = (req, res) => {
    if (req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
            .then(result => {
                if (!result) {
                    return res.status(404).send({ error: "No Email Found" });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                    if (isPasswordCorrect) {
                        return res.status(200).send({ access: createAccessToken(result) });
                    } else {
                        return res.status(401).send({ message: 'Incorrect email or password' });
                    }
                }
            })
            .catch(error => errorHandler(error, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

//[SECTION] Retrieve user details

    module.exports.getProfile = (req, res) => {

        return User.findById(req.user.id)
        .then(result => {
            result.password = "";
            return res.send(result);
        })
        .catch(err => res.send(err))
    };