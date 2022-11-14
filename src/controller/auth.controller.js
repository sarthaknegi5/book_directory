const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.getUsers = async (req,res) => {
    const data = await User.find({},{password: 0});
      
    res.status(200).json( {
        statusCode : 200,
        statusMessage : "User list", 
        data: data
    });
}



exports.getUserById = async (req,res) => {
    const { uname } = req.params;
    const userExist = await User.findOne({username : uname});

    if(!userExist) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "User not found!!"
        });
    }

    res.status(200).json( {
        statusCode: 200,
        statusMessage: 'User exists',
        data: {
            id: userExist._id,
            username: userExist.username
        }  
    });
}



exports.userSignup = async (req,res) => {
    const {username, password} = req.body;
    // use regEx for verification

    if(!username) {
        return res.status(400).json ( {
            statusCode: 400,
            statusMessage: "Please provide username to signup"
        });
    }
    else if(password.length < 6) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Password too short!!"
        });
    }

    const userExist = await User.findOne({username});
    if(userExist) {
        return res.status(400).json({
            statusCode : 400,
            statusMessage : "User already exists. Please login."
        });
    }

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password,salt);
    const user = await User.create({username , password : encryptedPassword})

    const token = jwt.sign (
        {
            id: user._id,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: '10m'
        }
    );

    user.token = token;
    
    res.status(200).json({
        statusCode: 200,
        statusMessage: "User added successfully",
        data: {
            id: user._id,
            username: user.username,
            accessToken: user.token
        }
    });
}



exports.userLogin = async(req,res) => {
    const {username, password} = req.body;
    if(!username) {
       return res.status(400).json( {
            statusCode: 400,
            statusMessage: 'Please provide username to login'
       });
    }

    else if(!password) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Please provide password to login"
        });
    }

    const userExist = await User.findOne({ username: username });
    if(!userExist) {
       return res.status(401).json ( {
            statusCode: 401,
            statusMessage: "User not found!!"
       });
    }
    
    else if (await bcrypt.compare(password, userExist.password) ==  false) {
        return res.status(401).json ( {
            statusCode: 401,
            statusMessage: 'Password entered is incorrect!!'
        });
    }

    const userExist1 = await User.findOne({ username: username }, {password: 0});

    const accessToken = jwt.sign (
        {
            id: userExist._id,
        },

        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '10m'
        }
    );

    const refreshToken = jwt.sign (
        {
            id: userExist._id,
        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    );

    res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            maxAge : 24 * 60 * 60 * 1000
        });

    userExist.save();
    //userExist.accessToken = accessToken;

    res.status(200).json( {
        statusCode: 200,
        statusMessage: 'User has been logged in',
        data: userExist1
    });
}



exports.refreshToken = async(req,res) => {
    if(req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        const { username } = req.body;

        const user = await User.findOne({username : username});

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err,decoded) => {
            if(err) {
                return res.status(401).json( {
                    statusCode: 401,
                    statusMessage: "Not authorized!!"
                })
            }

            else {

                const accessToken = jwt.sign(
                    {
                        id : user._id
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn : '15s'
                    }
                );

                return res.status(200).json( {
                    statusCode: 200,
                    statusMessage: "Access token generated",
                    data: {
                        "Access Token" : accessToken
                    }
                });
            }
        });
    }

    else {
        res.status(401).json( {
            statusCode: 401,
            statusMessage: "No refresh token available!!"
        });
    }
}



exports.userUpdate = async(req,res) => {
    const { uname } = req.params;
    const {username, password} = req.body;

    if(!username) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Username cannot be empty"
        });
    }

    else if(password.length < 6) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Password length cannot be less than 6"
        });
    }

    const userExist = await User.findOne({username : uname});

    if(!userExist) {
        return res.status(400).json( {
            statusCode : 400,
            statusMessage : "User not found!!"
        });
    }

    const id1 = userExist._id;
    const updateField = (val,prev) => !val ?prev :val;

    const updatedUser = ({
        username : updateField(username, userExist.username),
        password : updateField(password, userExist.password)
    });

    await User.updateOne( {
        id: userExist._id,
        $set: {
            username: updatedUser.username,
            password: updatedUser.password
        }
    });

    res.status(200).json( {
        statusCode : 200,
        statusMessage: "User updated successfully",
        data: {
            id: id1,
            username: updatedUser.username
        }
    });
}


exports.userDelete = async(req,res) => {
    const { uname } = req.params;

    const userExist = await User.findOne({ username : uname });

    if(!userExist) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "User not found!!"
        });
    }

    await User.deleteOne({username: uname});
    res.status(200).json({
        statusCode: 200,
        statusMessage: "User deleted successfully!!",
        data: userExist
    });
}