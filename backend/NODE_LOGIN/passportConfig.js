//Used to store logged in users session details into a browser cookie so they can use the application as an authenticated user
const LocalStrategy = require("passport-local").Strategy;
const { authenticate } = require("passport");
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');

function initialize (passport){
const authenticateUser = (email, password, done) => {

    //Authenticate user
    pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if(err){
                throw err;
            }
            console.log(results.rows);

            //If user is found within our DB
            if (results.rows.length > 0){
                const user = results.rows[0];
                
                //Compare passwords that the user put in the input form of login page to the one in the DB
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err){
                        throw err;
                    }

                    if(isMatch){
                        return done(null, user); //Will return no errors and return the user to store in the session cookie
                    }else{
                        return done(null, false, {message: "Password is not correct"}); //Will not return user because the pasword the user inputted was not the same as the password within the DB
                    }
                });
            }else{
                return done(null, false, {message: "Email is not registered"});
            }
        }
    );
};
    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
    }, 
    authenticateUser)
);

//Stores the user ID in the session cookie
passport.serializeUser((user, done) => done(null, user.id));

//Uses the user ID to obtain the users details from the DB and store the full object into the session when navigating the application
passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
        if (err){
            throw err;
        }
        return done(null, results.rows[0]);
    });
});
}
//Export the initialize function back into the server
module.exports = initialize;