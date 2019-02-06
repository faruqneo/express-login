const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//connected database model
let Login = require('../models/login')
let Article = require('../models/article')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

//route to index page
router.get('/', function(req, res){
   //  res.render('index')
   Article.find({}, function(err, articles){
       if(err)
       {
           console.log(err)
       }
       else
       {
           res.render('index',{
               articles: articles
           })
       }
   })
})

//route to index page
router.post('/newarticles', function(req, res){
    //  res.render('index')
    req.checkBody('title', 'Title is missing').notEmpty()
    req.checkBody('author', 'Author is missing').notEmpty()
    req.checkBody('body', 'Body is missing').notEmpty()

    let errors = req.validationErrors()

    if(errors)
    {
        res.render('add',{
            errors: errors
        })
    }
    else
    {
        let article = new Article()
        article.title = req.body.title
        article.author = req.body.author
        article.body = req.body.body

        article.save(function(err){
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.redirect('/')
            }
        })
    }
 })

//articles view
router.get('/article/view/:id', function(req, res){
    Article.findById(req.params.id, function(err, articles){
        res.render('view',{
            article: articles
        })
    })
})

//articles updates
router.get('/article/update/:id', function(req, res){
    Article.findById(req.params.id, function(err, articles){
        res.render('details',{
            article: articles
        })
    })
})

//articles deleted
router.get('/article/delete/:id', function(req, res){
    let id = {_id: req.params.id}
    Article.deleteOne(id, function(err)
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.redirect('/')
        }
    })
})

//router to update
router.post('/update/articles/:id', function(req, res){
        let article = req.body;

        let id = {_id:req.params.id}
        
        Article.updateOne(id, article,function(err){
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.redirect('/')
            }
        })
})

//route to add articles
router.get('/add/articles', function(req, res){
    res.render('add')
})

router.get('/signin', function(req, res){
    res.render('login')
})

router.get('/new', function(req, res){
    res.render('registration')
})

router.get('/success', function(req, res){
    res.render('success')
   // console.log(res)
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
            failureFlash: 'true'
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