import express from 'express';
import { Request,Response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import dotenv from 'dotenv';
// import routes from './routes';
import routes from './routes/rout.js';
import bcrypt from 'bcrypt';
import pool from './config/db.conn.js';
import { generateKey } from 'crypto';
import generateToken from './config/token.js';
import authenticate from './config/authenticate.js';

dotenv.config();

const saltround=10;
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json())
app.use(routes);

app.get('/', (req:Request, res:Response) => {
    res.send({
        message:"given id is",
        id:req.params.id
    });
})


app.get('/ID/:id/Name/:name', (req:Request, res:Response) => {
    res.send({
        message:"given id & name is",
        di:req.params.id,                      //koi b naam: req.params/body. .. but koi b naam will display in data
        mane:req.params.name

    });
})
// params- for send given value
// body -for write value

app.post('/',(req:Request,res:Response)=>{
    res.send({

        name:req.body.name
    })
}) //  .. : req.body- will demonstrate .. : { .. :  " value" }
   //  .. : req.body... -will demonstrate .. : "value"



app.post('/ID/:id/Name/:name',(req:Request,res:Response)=>{
    res.send({
        data:req.body,
        params:{
            id:req.params.id,
            name:req.params.name
        }
    })
})

////////////////////////////////mysql begins now (Some of app.@@@@ formats copied from above) /////////////////////////////////////////////////////////////

app.get('/details/:id',authenticate, (req:Request, res:Response) => {

    var pool=mysql.createPool({
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD,
        database:process.env.DATABASE,
        connectionLimit:10,
        multipleStatements:true

    });

    pool.getConnection(function(err:any,conn:any){
        if(err){
            console.log("error");
            console.log(err);
            
            res.send({
                success:false,
                statusCode:500,
                message:"Error"
            });  
            return;
        }
        console.log("the id is " + req.params.id);

        //if connected
        conn.query('SELECT * FROM userdata.hashdata WHERE id=?',[req.params.id],function (err:any,rows:any) {
            if (err) {
                conn.release();

                return res.send({
                    success:false,
                    statusCode:200,
                });  
            }

            res.send({
                message:'success',
                statusCode:200,
                data:rows
            });
            conn.release();

        })   
    })
});


///////////////////////////////////post data////////////////////////////////////////////////////////////////////////

// app.post('/data', (req:Request, res:Response) => {

//     var pool=mysql.createPool({
//         host:process.env.HOST,
//         user:process.env.USER,
//         password:process.env.PASSWORD,
//         database:process.env.DATABASE,
//         connectionLimit:10,
//         multipleStatements:true
//     });

//     pool.getConnection(function(err:any,conn:any){
//         if(err){
//             console.log("error");
//             console.log(err);
            
//             res.send({
//                 success:false,
//                 statusCode:500,
//                 message:"Error during connection"
//             });  
//             return;
//         }
//         console.log(req.body);
        

//         //if connected
//         conn.query('insert into userdata.register values(?,?)',[req.body.id , req.body.email],function (err:any,rows:any) {
//             if (err) {
//                 conn.release();
//                  console.log(err);
                 
//                 return res.send({
//                     success:false,
//                     statusCode:200,
//                 });  
//             }
//         else{
//             res.send({
//                 message:'success',
//                 statusCode:200,
//                 data:rows
//             });}
//             conn.release();

//         })   
//     })
// })

////////////////////////////////////hashing the data/////////////////////////////////////////////////////////////// 

app.post('/hash', (req:Request, res:Response) => {

    var pool=mysql.createPool({
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD,
        database:process.env.DATABASE,
        connectionLimit:10,
        multipleStatements:true
    });

    pool.getConnection(function(err:any,conn:any){
        if(err){
            console.log("error");
            console.log(err);
            
            res.send({
                success:false,
                statusCode:500,
                message:"Error during connection"
            });  
            return;
        }

        bcrypt.hash(req.body.password , saltround ,(err:any,hash:string)=>{
            if (err) {
                res.send({
                    success:false,
                    statusCode:500,
                    message:"Error during connection"
                });  
                return;
            }
            else{
                console.log(req.body);
        

                 //if connected
                 conn.query('insert into userdata.hashdata values(?,?,?)',[req.body.id , req.body.email, hash],function (err:any,rows:any) {
            if (err) {
                conn.release();
                 console.log(err);
                 
                return res.send({
                    success:false,
                    statusCode:200,
                });  
            }
            else{
            res.send({
                message:'success',
                statusCode:200,
                data:rows
            });}
            conn.release();

        })  
            }
        })

         
    })
})

//////////////////////////////////////authentication//////////////////////////////////////////////////////////////////////////////

app.post('/login', (req:Request, res:Response) => {

    var pool=mysql.createPool({
                host:process.env.HOST,
                user:process.env.USER,
                password:process.env.PASSWORD,
                database:process.env.DATABASE,
                connectionLimit:10,
                multipleStatements:true
            });

    pool.getConnection(function(err:any,conn:any){
        if(err){
            console.log("error");
            console.log(err);
            
            res.send({
                success:false,
                statusCode:500,
                message:"Error during connection"
            });  
            return;
        }

        console.log(req.body);
        conn.query('select password from hashdata WHERE email=?',[req.body.email],function (err:any,rows:any) {
            if (err) {
                conn.release();

                return res.send({
                    success:false,
                    statusCode:400,
                    data:err
                });  
            }
            // const row= [
            //     {
            //       id: 1,
            //       username: "johndoe",
            //       password: "secret12",
            //     },
            //     {
            //       id: 2,
            //       username: "janedoe",
            //       password: "secret23",
            //     },
            //   ]
            console.log(rows);
            const hash= rows[0].password;
            
         bcrypt.compare(req.body.password , hash , function(err,result){
            if (err) {
        
             res.send({
                    message:'failed',
                    statusCode:500,
                    data:err
                });  
            }

            if (result) {
        
                res.send({
                       message:'success',
                       statusCode:200,
                       data:{token:generateToken(req.body.email)}
                   });  
               }
            else{
                res.send({
                        message:'failed',
                        statusCode:500,
                        data:err
                   });  
               }
         })
            
            conn.release();

        })   
    })
});


         
    



app.listen(process.env.PORT, () => {
    console.log(`The application is listening on port ${process.env.PORT}`);
});