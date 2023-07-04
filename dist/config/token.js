import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
dotenv.config();
const generateToken = function generate(user) {
    const tokenSecret = 'my-token-secret';
    return Jwt.sign({ data: user }, tokenSecret, { expiresIn: process.env.EXPIRESIN });
};
export default generateToken;
