import jwt from 'jsonwebtoken';


const PRIVATE_KEY = 'JpvL8yCjZJjLCa5baNXtuk6DGrxxTZrRx9XBhUErl9U'

export const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn:'24h'});
    return token;
}

export const authToken = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    console.log(authHeader, 'authHeader');
    if(!authHeader) return res.status(401).send({error: 'Not authenticated'});
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'});

        req.user = credentials.user;
        console.log('estoy en next');
        next();
    });
}