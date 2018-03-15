const User = require('../models/user');
var md5 = require('md5');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, errorMessage: 'Please provided e-mail' });
        } else {
            if (!req.body.username) {
                res.json({ success: false, errorMessage: ' Please provided a username' });
            } else {
                if (!req.body.password) {
                    res.json({ success: false, errorMessage: ' Please provided a password' });
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    })
                    user.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'Username or  e-mail or password already exist', err });
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, errorMessage: err.errors.email.message })
                                    }
                                } else {
                                    res.json({ success: false, message: 'could not save user:Error', err });
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Account Registred!' });
                        }
                    })

                }
            }

        }

    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided' });
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Email is already used' })
                    } else {
                        res.json({ success: true, message: 'Email is available' });
                    }
                }
            })
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'User Name was not provided' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'User Name is already used' })
                    } else {
                        res.json({ success: true, message: 'User Name is available' });
                    }
                }
            })
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'No  email was provided!' })
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'No password was provided!' })
            } else {
                User.findOne({ email: req.body.email}, (err, user) => {
                    if (err) {
                        // console.log(User, "err")
                        res.json({ success: false, message: err });
                    } else {
                        // console.log(user,"login")
                        if (!user) {
                            res.json({ success: false, message: "your email is not registred!" })
                        } else {
                            // const validaPassword = user.comparePassword(req.body.password);
                            // console.log(validaPassword, "validaPassword")
                            if (req.body.password !== user.password) {
                                res.json({ success: false, message: 'Password invalid!'})
                            } else {
                                var token = jwt.sign({ userId:user._id },config.secret, {expiresIn:'20h'});
                                // var toekn = md5( req.body.email +'shhhhh' + Date.now());
                                res.json({ success: true, message: ' You are Login Success!', token : token,user:{email: user.email} });
                            }
                        }
                    }

                });
            }
        }
    });
    router.use((req,res,next)=>{
        const token = req.headers['authorization'];
        if(!token){
            res.json({success:false,message:'No token provided'});
        }else{
           jwt.verify(token, config.secret, (err, decoded)=>{
            if(err){
                res.json({success: false,message: 'Token invalid:' + err});
            }
            else{
                req.decoded = decoded;
                next();
            }
           });
        }
    });

    

router.get('/profile',(req,res)=>{
           User.findOne({ _id: req.decoded.userId}).select('username email').exec((err,user)=>{
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({success:false,message:'user not found'});
                    } else {
                         res.json({success: true, user: user});
                    }
                }
            })

})


    return router;
}