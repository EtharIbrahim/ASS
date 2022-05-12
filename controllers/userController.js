const User = require('../Models/userModel');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

exports.getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
        let newUser = ({ ...user }._doc);
        delete newUser.password
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.signUp = async (req, res) => {
    const { password, retype, firstName, lastName, email, username } = req.body;
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });
    const ifUsernameAlreadyPresent = await User.findOne({ username: req.body.username });
    if (password !== retype) {
        res.status(201).json({ errorMessage: "Passwords don't match" });
    }
    else if (ifEmailAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
    }
    else if (ifUsernameAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Username already exists. Please try another one.' });
    }
    else {
        var salt = await bcrypt.genSaltSync(10);
        var hash = await bcrypt.hashSync(password, salt);
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: hash
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    }
}


exports.login = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }]
    });
    if (findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                    role: findUser.role
                }
            }
            await jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) {
                    res.status(400).json({ errorMessage: 'Jwt Error' })
                }
                if (token) {
                    req.session.token = token;
                    const { _id, firstName, lastName, role, username, email } = findUser;
                    res.status(200).json({
                        _id,
                        role,
                        firstName,
                        lastName,
                        username,
                        email,
                        successMessage: 'Logged In Successfully',
                    });
                }
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }

    } else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}

exports.updateUserProfile = async (req, res) => {
    const findUser = await User.findOne({ _id: req.params.id });
    if (findUser) {
        findUser.firstName = req.body.firstName;
        findUser.lastName = req.body.lastName;
        findUser.email = req.body.email;
        findUser.username = req.body.username;

        const saveUser = await findUser.save();
        if (saveUser) {
            let newUser = ({ ...saveUser }._doc);
            delete newUser.password
            res.status(200).json({ successMessage: 'User Updated Successfully', user: newUser })
        }
    } else {
        res.status(404).json({ errorMessage: 'User not found.' })
    }
}

exports.updateRole = async (req, res) => {
    await User.findOne({ _id: req.params.id }).then(user => {
        if (!user) {
            res.status(201).json({ errorMessage: 'User not found!' });
        }
        if (user) {
            user.role = req.body.role;
            user.save((error, result) => {
                let newUser = ({ ...result }._doc);
                delete newUser.password
                if (error) {
                    res.status(400).json({ errorMessage: 'Failed to update role' });
                } else {
                    res.status(200).json({ successMessage: 'Role updated Successfully.', user: newUser })
                }
            })
        }
    });
}