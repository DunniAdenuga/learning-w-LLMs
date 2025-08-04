//Require/Import .env variables that were stored
require("dotenv").config(); 

//Require the Node PostreSQL library package that was installed onto the computer
const{ Pool } = require("pg"); 

//Check to see if apps host is in production
const isProduction = process.env.NODE_ENV === "production"; 

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

//Initialize a new port variable. If the app is in production, Use the database url for production; Otherwise, use our connectionString
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

//Export
module.exports = { pool };