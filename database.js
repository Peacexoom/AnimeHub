const {createPool} = require('mysql2');

const pool = createPool(
    {
        host: 'localhost',
        user : 'root',
        password : "Solanki@11",
        connectionLimit : 10000
    }
)

pool.query('select * from student.student', (err,res)=>{
    return console.log(res);
})

// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//     user : 'root',
//     password : 'Solanki@11'

// });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
