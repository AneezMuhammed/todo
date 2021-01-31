const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ToDo',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Server is running at port no : 3000'));


//Get all todo's
app.get('/todo', (req, res) => {
    mysqlConnection.query('SELECT * FROM TODO', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Create a new todo entry
app.post('/todo', (req, res) => {
    let temp = req.body;
    var sql = "SET @ID = ?;SET @Name = ?; \
    CALL TODOAddOrEdit(@ID,@Name);";
    mysqlConnection.query(sql, [temp.ID, temp.Name], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted TODO id : '+element[0].ID);
            });
        else
            console.log(err);
    })
});

//Update a TODO entry
app.put('/todo', (req, res) => {
    let temp = req.body;
    var sql = "SET @ID = ?;SET @Name = ? \
    CALL TODOAddOrEdit(@EmpID,@Name);";
    mysqlConnection.query(sql, [temp.EmpID, temp.Name], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});

//Delete a todo entry
app.delete('/todo/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM TODO WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});