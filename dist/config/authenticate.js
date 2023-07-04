import Jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.send({
            message: 'no token found',
            statusCode: 401,
            success: false
        });
    }
    else {
        const tokenSecret = 'my-token-secret';
        Jwt.verify(token.split(' ')[1], tokenSecret, (err, value) => {
            if (err) {
                res.send({
                    success: false,
                    statusCode: 401,
                    message: 'invalid token'
                });
            }
            else {
                req.user = value.data;
                console.log(req.user);
                next();
            }
        });
    }
};
export default authenticate;
