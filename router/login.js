const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//connected database model
let Login = require('../models/login')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', function(req, res){
    res.render('index')
})

router.get('/signin', function(req, res){
    res.render('login')
})

router.get('/new', function(req, res){
    res.render('registration')
})

router.get('/success', function(req, res){
    res.render('success')
})

//login
router.route('/login')
//ckeck for get
    .get(function(req, res){
        res.render('index')
    })
//check for post
    .post(function(req, res, next){
        passport.authenticate('local',{
            successRedirect: '/success',
            failureRedirect: '/',
            failureFlash: 'false'
        })(req, res, next);
    })
//check for put
    .put(function(res, res){
        res.render('restricted')
    })


//registration
router.route('/reg')
//ckeck for get
.get(function(req, res){
    res.render('restricted')    
})
//check for post
.post(function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const pwd = req.body.pwd;
    const cpwd = req.body.cpwd;
    
    req.checkBody('name', 'Name is missing').notEmpty()
    req.checkBody('email', 'Email is missing').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('phone', 'Phone is missing').notEmpty()
    req.checkBody('pwd', 'Password is missing').notEmpty()
    req.checkBody('cpwd', 'Confirm Password is missing').notEmpty()
    req.checkBody('cpwd', 'Password do not match').equals(req.body.pwd)

    let errors = req.validationErrors();

    if(errors)
    {
        res.render('registration',{
            errors: errors
        })
    }
    else
    {
        let newlogin = new Login({
            name: name,
            email: email,
            phone: phone,
            password: pwd
        })
        console.log('bcrypt')
        bcrypt.genSalt(10, function(err, salt){
           // console.log('bcrypt2')
            bcrypt.hash(newlogin.password, salt, function(err, hash){
                if(err)
                {
                    console.log(err)
                }
                newlogin.password = hash;
                newlogin.save(function(err){
                    if(err)
                    {
                        console.log(err)
                        return;
                    }
                    else
                    {
                        res.redirect('/')
                    }
                })
            })
        })

    }


})
//check for put
.put(function(res, res){
    res.render('restricted')
})

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
})

module.exports = router