import mysql from 'mysql2';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';

dotenv.config();

const generateToken:any= function generate(user:any){
    const tokenSecret: string = 'my-token-secret';
    return Jwt.sign({data:user},tokenSecret, {expiresIn: process.env.EXPIRESIN})
}

export default generateToken;