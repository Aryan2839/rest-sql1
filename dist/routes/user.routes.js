import { Router } from "express";
import mysql from "mysql";
const usersRouter = Router();
usersRouter.get('/', (request, response) => {
    return response.json("all good");
});
usersRouter.get('/details/:id', (req, res) => {
    var pool = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        connectionLimit: 10,
        multipleStatements: true
    });
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log("error");
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: "Error"
            });
            return;
        }
        console.log("the id id" + req.params.id);
        //if connected
        conn.query('SELECT * FROM userdata.employee WHERE eid=?', [req.params.id], function (err, rows) {
            if (err) {
                conn.release();
                return res.send({
                    success: false,
                    statusCode: 200,
                });
            }
            res.send({
                message: 'success',
                statusCode: 200,
                data: rows
            });
            conn.release();
        });
    });
});
usersRouter.post('/data', (req, res) => {
    var pool = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        connectionLimit: 10,
        multipleStatements: true
    });
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log("error");
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: "Error during connection"
            });
            return;
        }
        console.log(req.body);
        //if connected
        conn.query('insert into userdata.register values(?,?)', [req.body.id, req.body.email], function (err, rows) {
            if (err) {
                conn.release();
                console.log(err);
                return res.send({
                    success: false,
                    statusCode: 200,
                });
            }
            else {
                res.send({
                    message: 'success',
                    statusCode: 200,
                    data: rows
                });
            }
            conn.release();
        });
    });
});
export default usersRouter;
