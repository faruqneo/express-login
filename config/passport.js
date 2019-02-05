const LocalStrategy = require('passport-local').Strategy
const Login = require('../models/login')
const config =  require('./database')
const bcrypt = require('bcryptjs')

module.exports = function(passport){
    passport.use(new LocalStrategy(
        function(username, password, done) {
          Login.findOne({ email: username }, function (err, user) {
            if (err) throw err;
            if (!user) { return done(null, false, {message: 'No user found'}); }
            
            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){ return done(null, user)}
                else{return done(null,false, {message: 'worng password'});}
            })
          });
        }
      ));


      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Login.findById(id, function(err, user) {
          done(err, user);
        });
      });

}


