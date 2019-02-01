
const msql = require("mysql")

const mySqlConnection = msql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass@word1',
    database: 'ECartAppDB',
    multipleStatements: true
})

mySqlConnection.connect ( (err) => {
    if(err){
        console.error(err);
        return;
    } else{
        console.log("Db is connected")
    }
})

module.exports = mySqlConnection

