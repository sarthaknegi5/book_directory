const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
 


router.get('/users', async (req,res) => {
    const data = await User.find();
    res.status(200).send(data);
});

router.get('/users/:uname', async (req,res) => {
    const { uname } = req.params;
    const userExist = await User.findOne({username : uname});

    if(!userExist) {
        return res.status(400).send("User not found!!");
    }

    res.status(200).send(userExist);
});


router.post('/users/signup', async (req,res) => {
    const {username, password} = req.body;
    // use regEx for verification
    if(password.length < 6) {
        return res.status(400).send("Password too short!!");
    }

    const userExist = await User.findOne({username});
    if(userExist) {
        return res.status(400).json({
            statusCode: 400 ,
            statusMessage:"User already exists. Please login."
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
        message: "User added successfully!!",
        user
    });
});



router.post('/users/login', async (req,res) => {
    const {username, password} = req.body;
    if(!username || !password) {
       return res.status(400).send("Username or password not found!!");
    }
    const userExist = await User.findOne({ username: username });
    if(!userExist) {
       return res.status(401).send("User does not exist");
    }
    
    else if (await bcrypt.compare(password, userExist.password) ==  false) {
        return res.status(401).send("Incorrect password entered");
    }

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
        message: 'User logged in',
        username,
        accessToken,
        refreshToken
    });



});


router.post('/refresh', async(req,res) => {
    
    if(req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        const { username } = req.body;

        const user = await User.findOne({username : username});

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // console.log(decoded);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err,decoded) => {
            if(err) {
                return res.status(401).send("Not authorized!!");
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

                

                return res.json({accessToken});
            }
        });
    }

    else {
        res.status(401).json("No refresh token available!");
    }
});


router.put('/users/:uname', async(req,res) => {
    const { uname } = req.params;
    const {username, password} = req.body;
    const userExist = User.findOne({username : uname});

    if(!userExist) {
        return res.status(400).send("User not found!!");
    }

    const updateField = (val,prev) => !val ?prev :val;

    const updatedUser = ({
        username : updateField(username, userExist.username),
        password : updateField(password, userExist.password)
    });

    await User.updateOne( {
        id: id,
        $set: {
            username: updatedUser.username,
            password: updatedUser.password
        }
    });

    res.status(200).send("User updated successfully");
});


router.delete('/users/:uname', async(req,res) => {
    const { uname } = req.params;

    const userExist = await User.findOne({ username : uname });

    if(!userExist) {
        return res.status(400).send("User not found");
    }

    await User.deleteOne({username: uname});
    res.status(200).json({
        message: "User deleted successfully!!",
        userExist
    });

});

module.exports = router;