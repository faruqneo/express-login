const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const login = require('./router/login')
const expressValidator = require('express-validator')
const config = require('./config/database')
const passport = require('passport')


//Init app
const app = express()

//connection code for mongodb
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

//checking for connection
db.once('open', function(req, res){
    console.log("connected with mongodb")
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//setting up view pages
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
        }
        return {
        param : formParam,
        msg   : msg,
        value : value
        };
    }
}));

//Passport config
require('./config/passport')(passport)
//Password middelware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null ;
    next();
})

//Home Router
app.use('/', login)


//server running
app.listen('3000', function(){
    console.log("server is running")
});

