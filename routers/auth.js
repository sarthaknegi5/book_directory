const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = '6b983ad6f9b8d990490e5a4bf6150ee9314a2a4b5248d73777ae94012d533b3ae52875';


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
        return res.send("User already exists. Please login.");
    }

    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password,salt);
    const user = await User.create({username,password : encryptedPassword})
    const maxAge = 3*60*60;

    const token = jwt.sign (
        {
            id: user._id,
            username
        },

        jwtSecret,

        {
            expiresIn: maxAge
        }
    );

            // res.cookie('jwt', token, {
            //     httpOnly: true,
            //     maxAge : maxAge * 1000
            // });
            //user.save();

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

    // console.log(bcrypt.compare(password, userExist.password));
    // console.log(userExist.password);

    const maxAge = 3*60*60;
    const token = jwt.sign (
        {
            id: userExist._id,
            username
        },

        jwtSecret,
        {
            expiresIn: maxAge
        }
    );

    userExist.token = token;

    res.status(200).json( {
        message: 'User logged in',
        userExist
    });
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

    await User.deleteOne({usernmae: uname});
    res.status(200).json({
        message: "User deleted successfully!!",
        userExist
    });

});

module.exports = router;