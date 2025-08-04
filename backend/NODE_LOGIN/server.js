const express = require('express');
const app = express() //Have access to all the express library features/functions
const { pool } = require('./dbConfig'); //Import dbConfig file to utilize the Pool method
const bcrypt = require('bcrypt'); //Allows us to hash passwords
const session = require('express-session');
const passport = require("passport");
const flash = require('express-flash');



const initializePassport = require("./passportConfig");
initializePassport(passport);

const PORT = process.env.PORT || 4000; //Uses Port that is in the .env file or port 4000 when in development mode

//Middleware - Acts as a bridge/pipe between the DB and application
app.set('view engine', 'ejs'); //Tells the app to use the 'ejs' view engine
app.use(express.urlencoded({extended: false})); //Allows to send details from frontend to the server
app.use(session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Routes that will render the 'ejs' files
app.get("/", (req, res) => { //root directory
    res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res)=>{
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res)=>{
    res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res)=>{
    res.render("dashboard", {user: req.user.name});
});

app.get('/users/logout', (req, res, next) => {
    req.logOut(function(err){
        if(err){
            return next(err);
        }
        req.flash('success_msg', "you have logged out");
        res.redirect('/users/login');
    });
});

app.post("/users/register", async (req, res) => {
    let { name, email, password, password2} = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = []; //Use this for form validation. If any of the validation checks fail, they will push an error message into the errors empty array
    
    //Validation checks
    if (!name || !email || !password || !password2){
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6){
        errors.push({ message: "Password must be at least 6 characters" });
    }

    if (password != password2){
        errors.push({ message: "Passwords do not match" });
    }

    if(errors.length > 0){
        res.render("register", { errors });
    }else{
        //form validation has passed
        
        //Hash out passwords for encryption
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        
        //Query our database to see if the user already exists before registering
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results)=>{
                if (err){
                    throw err
                }
                console.log(results.rows);
                
                //If user is already in the DB
                if(results.rows.length > 0){
                    errors.push({message: "Email already registered"});
                    res.render("register", {errors});
                }else{
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, 
                        [name, email, hashedPassword], 
                        (err, results) => {
                            if(err){
                                throw err
                            }
                            console.log(results.rows);
                            req.flash('success_msg', "You are now registered. Please log in");
                            res.redirect("/users/login");

                        }
                    )
                }
            }
        )
    }
    
});

app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true //If we can't authenticate the user, express will render one of the failure messages within passportConfig.js
})
);

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/users/dashboard');
    }
    next();
}

    

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

//Listens to the server and connects it to frontend throught the port
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

